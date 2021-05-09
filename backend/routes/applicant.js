var express = require("express");
var router = express.Router();
const protect = require("../utils");
require('dotenv').config('../.env');
const FuzzySearch = require("fuzzy-search");
const isEmpty = require("is-empty");

// Load job data
const Job = require('../models/Jobs')
const JobApplication = require('../models/jobapplication')
const Applicant = require('../models/applicants')
const Recruiter = require('../models/recruiters')

// Load Validator
const validateApplyJobInput = require('../validation/job_application');
const ValidateProfileUpdateInput = require('../validation/applicant_profile_update')

async function asyncforEach(array, callback) {
    for (let i = 0; i < array.length; i++) {
        await callback(array[i], i);
    }
}


// @route: /applicant/jobs/:id
// @desc: POST for a job Application
// @access: Private
router.post('/jobs/:id', protect(async (req, res, result) => {

    if (result.type != process.env.USER_APPLICANT) {
        res.status(403).json({error: "Forbidden"});
        return;
    }

    // steps
    // 1. check if already applied
    // 2. number of open applications
    // 3. if he has a running job
    // 4. apply then
    // 5. max_applications crossed.

    const {errors, isValid} = validateApplyJobInput(req.body);

    if (!isValid) {
        return res.status(400).json({errors});
    }

    const job_id = req.params.id;
    const applicant_id = result.id;

    let ok = true;

    // check for active job
    let jobs = await JobApplication
        .find({applicant_id: applicant_id, status: "Selected"})
        .populate({path: 'job_id', select: 'duration'})
        .lean()

    let curr_time = new Date();
    jobs.forEach((job, id) => {
        let startTime = job.date_of_ac;
        let jobFinishTime = new Date(startTime.setMonth(startTime.getMonth() + job.job_id.duration));
        if (curr_time <= jobFinishTime) {
            res.status(400).json({errors: {sop: "You have a job running, cannot apply to this"}});
            ok = false;
            return ;
        }
    })   

    if(!ok) return;

    // number of open applications
    jobs = await JobApplication
                    .find({applicant_id: applicant_id, status: "Applied"})
    
    if (jobs.length === 10) {
        res.status(400).json({errors: {sop: "You cannot have more than 10 open applications"}});
        ok = false;
    }
    
    if(!ok) return ;

    jobs = await JobApplication
                    .findOne({applicant_id: applicant_id, job_id: job_id})
    
    if (jobs) {
        res.status(400).json({errors: {sop: "You have already applied to this job"}});
        ok = false;
    }

    if(!ok) return ;

    const newJobApplication = new JobApplication({
        applicant_id: applicant_id,
        job_id: job_id,
        sop: req.body.sop
    });

    newJobApplication
        .save()
        .then(job => res.json(job))
        .catch(err => {
            console.log(err);
            res.status(500).json(err);
        });

}))

// @route: /applicant/home
// @desc: GET all jobs, don't show rejected jobs and jobs with passed deadline
// @access: Private
router.post('/home', protect(async (req, res, result) => {

    if (result.type != process.env.USER_APPLICANT) {
        res.status(403).json({error: "Forbidden"});
        return;
    }

    const applicant_id = result.id;

    await Job
      .find({})
      .lean()
      .populate('recruiter_id')
      .exec( (error, queries) => {
        if (error) {
            res.status(500).json(error);
            return;
        }
        let jobs = []
        const func = async () => {
            await asyncforEach(queries, async (query) => {
                // need number of job_applications with status => {Applied, Selected}

                let curr_time = await new Date();
                let deadline = await new Date(query.deadline);
            
                // return if deadline passed
                if(curr_time > deadline) return;

                job = {}
                job.title = query.title;
                job.recruiter_name = query.recruiter_id.name;
                job.rating = query.rating;
                job.salary = query.salary;
                job.deadline = query.deadline;
                job.duration = query.duration;
                job.type = query.job_type;
                job.id = query._id;
                job.status = "Apply";

                // check if already applied
                const temp = await JobApplication
                                    .findOne({applicant_id: applicant_id, job_id: query._id})
                        
                if(temp) {
                    job.status = temp.status;
                    if(temp.status === "Selected") {
                        let startTime = await new Date(temp.date_of_ac);
                        let jobFinishTime = new Date(startTime.setMonth(startTime.getMonth() + query.duration));
                        if(jobFinishTime < curr_time) job.status = "Finished";
                    }
                }
                // check for full
                if (job.status === "Apply") {

                    let count = await JobApplication
                                        .find({ job_id: query._id, status: {$ne: 'Rejected'}})
                
                    count = count.length;
                    
                    if(count >= query.max_applications) {
                        job.status = "Full";
                    } else {
                        job.status = "Apply";
                    }   
                }

                if(job.status !== "Rejected")
                    jobs.push(job);
            })

            if (req.body.search && !isEmpty(req.body.search)) {
                const searcher = new FuzzySearch(jobs, ['title'], {
                    caseSensitive: false,
                    sort: true
                });
                jobs = searcher.search(req.body.search)
            }

            res.json(jobs);
        }
        func();
    })
}))

// @route: /applicant/profile
// @desc : GET Applicant Profile
// @access: Private
router.get('/profile', protect( async (req, res, result) => {
    if (result.type != process.env.USER_APPLICANT) {
        res.status(403).json({error: "Forbidden"});
        return;
    }
    const applicant_id = result.id;
    await Applicant
      .findOne({_id: applicant_id})
      .lean()
      .select("-password")
      .exec( (error, resp) => {
        if (error) {
            res.status(500).json(error);
            return;
        }
        res.json(resp);
      })
}))

// @route: /applicant/profile
// @desc : Update Applicant Profile
// @access: Private
router.put('/profile', protect( async (req, res, result) => {
    if (result.type != process.env.USER_APPLICANT) {
        res.status(403).json({error: "Forbidden"});
        return;
    }
    const {errors, isValid} = ValidateProfileUpdateInput(req.body);

    if (!isValid) {
        return res.status(400).json({errors});
    }

    console.log(req.body);

    const applicant_id = result.id;
    await Applicant
        .findByIdAndUpdate(
            applicant_id,
            req.body,
            {new: true},
            (err, applicant) => {
                if(err) {
                    res.status(500).json(err);
                    return ;
                } else {
                    res.json(applicant);
                    return ;
                }
            }
        )
}))

// @route: /applicant/myapplictions
// @desc : GET applications of users
// @access: Private
router.get('/myapplications', protect( async (req, res, result) => {

    if (result.type != process.env.USER_APPLICANT) {
        res.status(403).json({error: "Forbidden"});
        return;
    }
    const applicant_id = result.id;
    await JobApplication
    .find({applicant_id: applicant_id})
    .lean()
    .populate({
        path: 'job_id',
        select: 'recruiter_id salary title _id',
        populate: {
            path: 'recruiter_id', select: 'name -_id'
        }
    })
    .exec( (error, queries) => {
        if (error) {
            res.status(500).json(error);
            return;
        }
        apps = [];
        queries.forEach( (query) => {
            app = {}
            app.title = query.job_id.title;
            app.date_of_ac = query.date_of_ac;
            app.salary = query.job_id.salary;
            app.recruiter_name = query.job_id.recruiter_id.name;;
            app.status = query.status; // will rate the job if he was selected
            app.job_id = query.job_id._id;
            app.rating = query.rating;
            app._id = query._id;
            apps.push(app);
        })
        res.json(apps);
    })
}))

// @route: /applicant/myapplictions/rate/:jid
// @desc : Give Rating to Job
// @access: Private
router.put('/myapplications/rate/:jid', protect( async (req, res, result) => {
    if (result.type != process.env.USER_APPLICANT) {
        res.status(403).json({error: "Forbidden"});
        return;
    }
    const job_id = req.params.jid;
    const applicant_id = result.id;

    console.log(req.body);

    // steps 
    // 1. check if application was accepted
    // 2. already rated
    // 3. count number of people who rated
    // 4. total rating
    // 5. update rating in job
    // 6. update rating in JobApplication

    let isAccepted = false, alreadyRated = false, id;

    let job = await JobApplication
                    .findOne({job_id: job_id, applicant_id: applicant_id})
                    .lean()

    if(job.status === "Selected") {
        isAccepted = true;
        id = job._id;
        if (job.rating !== -1) {
            alreadyRated = true;
            return;
        } 
    }
    
    if(!isAccepted || alreadyRated) {
        res.status(500).json({msg: "you cannot rate this job"});
        return;
    }

    let totalPersons = 0, totalRating = 0;
    let applications = await JobApplication
        .find({job_id: job_id, status: "Selected"})
        .lean()

    applications.forEach((r, id) => {
        if(r.rating !== -1) {
            totalPersons += 1;
            totalRating += r.rating;
        }
    })
    
    let newRating = Math.round((totalRating + req.body.rating)/(totalPersons + 1));

    await JobApplication
        .findByIdAndUpdate(
            id,
            {rating: req.body.rating}
        )
    
    await Job
        .findByIdAndUpdate(
            job_id,
            {rating: newRating}
        )
    
    res.json({msg: "Success"});
    
}))

module.exports = router;

// Other details
// I am working with post request as axios doesn't allow to send body with get request and I am lazy to use url encoding.