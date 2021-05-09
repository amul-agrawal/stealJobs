var express = require("express");
var router = express.Router();
const protect = require("../utils");
require('dotenv').config('../.env');
const Validator = require('validator');
const isEmpty = require('is-empty');

// Validation
const validateJobInput = require('../validation/job')
const ValidateRecruiterProfile = require('../validation/recruiter_profile');

// Load job data  
const Job = require('../models/Jobs')
const Recruiter = require('../models/recruiters');
const JobApplication = require("../models/jobapplication");
const Applicant = require("../models/applicants")

async function asyncforEach(array, callback) {
  for (let i = 0; i < array.length; i++) {
      await callback(array[i], i);
  }
}

// @route:  /recruiter/createjob
// @desc:   Post a job
// @access: Private
router.post('/createjob', protect( async (req, res, result) => {
  if (result.type != process.env.USER_RECRUITER) {
      res.status(403).json({error: "Forbidden"});
      return;
  }

  const {errors, isValid} = validateJobInput(req.body);

  if (!isValid) {
    return res.status(400).json({errors});
  }

  const recruiterId = result.id;

  const newJob = new Job({
    recruiter_id: recruiterId,
    title: req.body.title,
    max_applications: req.body.max_applications,
    max_positions: req.body.max_positions,
    deadline: req.body.deadline,
    skills_req: req.body.skills_req,
    job_type: req.body.job_type,
    duration: req.body.duration,
    salary: req.body.salary,
  });

  newJob
    .save()
    .then(job => res.json(job))
    .catch(err => {
        console.log(err);
        res.status(500).json(err);
    });

}));

// @route: /recruiter/profile
// @desc : GET profile
// @access: Private
router.get('/profile', protect( async (req, res, result) => {
  if (result.type != process.env.USER_RECRUITER) {
      res.status(403).json({error: "Forbidden"});
      return;
  }
  const recruiter_id = result.id;
  Recruiter
    .findOne({_id: recruiter_id})
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

// @route: /recruiter/profile
// @desc : PUT profile
// @access: Private
router.put('/profile', protect( async (req, res, result) => {
  if (result.type != process.env.USER_RECRUITER) {
      res.status(403).json({error: "Forbidden"});
      return;
  }

  const {errors, isValid} = ValidateRecruiterProfile(req.body);

  if (!isValid) {
      return res.status(400).json({errors});
  }

  const recruiter_id = result.id;
  Recruiter
    .findByIdAndUpdate(
      recruiter_id,
      req.body,
      {new: true},
      (err, recruiter) => {
          if(err) {
              res.status(500).json(error);
              return ;
          } else {
              res.json(recruiter);
              return ;
          }
      }
    )
    
}))

// @route: /recruiter/myjobs
// @desc : GET Jobs that are still active (not deleted)
// @access: Private
router.get('/myjobs', protect( async (req, res, result) => {
  // console.log(res.type);
  if (result.type != process.env.USER_RECRUITER) {
      res.status(403).json({error: "Forbidden"});
      return;
  }
  const recruiter_id = result.id;
  Job
    .find({recruiter_id: recruiter_id})
    .select(["_id", "title", "post_date", "max_applications", "max_positions", "deadline"])
    .lean()
    .exec( (error, resp) => {
      if (error) {
          res.status(500).json(error);
          return;
      }
      console.log(resp);
      res.json(resp);
    })
}))

// @route: /recruiter/myjobs
// @desc : Update your job
// @access: Private
router.put('/myjobs/:id', protect( async (req, res, result) => {
  // console.log(res.type);
  if (result.type != process.env.USER_RECRUITER) {
      res.status(403).json({error: "Forbidden"});
      return;
  }

  let errors = {};
  let max_applications = req.body.max_applications.toString();
  let max_positions = req.body.max_positions.toString();

  if(!max_applications || Validator.isEmpty(max_applications))
    errors.max_applications = "max applications should not be empty";
  else if(!Validator.isInt(max_applications)) {
    errors.max_applications = "max applications should be of type int";
  }

  if(!max_positions || Validator.isEmpty(max_positions))
    errors.max_positions = "max positions should not be empty";
  else if(!Validator.isInt(max_positions)) {
    errors.max_positions = "max positions should be of type int";
  }

  if (
    !Validator.isEmpty(max_applications) && !Validator.isEmpty(max_positions) && 
    Validator.isInt(max_applications) && Validator.isInt(max_positions) &&
    parseInt(max_applications) < parseInt(max_positions)
    ) {
      errors.max_positions = "Max Positions should be less than max applications";
    }

  if(!isEmpty(errors)) return res.status(400).json({errors});
 
  const job_id = req.params.id;
  Job
    .findByIdAndUpdate(
      job_id,
      req.body,
      {new: true},
      (err, job) => {
        console.log(job);
        if(err) {
            res.status(500).json(err);
            return ;
        } else {
            res.json(job);
            return ;
        }
    }
    )

}))

// @route: /recruiter/myjobs/:id
// @desc : Get a selected job applicants
// @access: Private
router.get('/myjobs/:id', protect( async (req, res, result) => {

  if (result.type != process.env.USER_RECRUITER) {
      res.status(403).json({error: "Forbidden"});
      return;
  }

  const job_id = req.params.id;
  const job_applications = await JobApplication.find({job_id: job_id});

  let ret = [];
  await asyncforEach(job_applications, async (job, id) => {
    let app_id = job.applicant_id;
    let applicant = await Applicant.findOne({_id: app_id});

    let now = {};
    now.applicant_name = applicant.name;
    now.skills = applicant.skills;
    now.date_of_ac = job.date_of_ac;
    now.date = job.date; 
    now.education = applicant.institute;
    now.applicant_rating = applicant.rating;
    now.sop = job.sop;
    now.status = job.status;
    now.application_id = job._id;
    now.id = job._id;

    if(job.status !== "Rejected")
      ret.push(now);
  })
  res.json(ret);                  

}))

// @route:  /recruiter//myjobs/application/:id
// @desc :  Change application's state, select applicant
// @access: Private
router.put('/myjobs/application/:id', protect( async (req, res, result) => {
  if (result.type != process.env.USER_RECRUITER) {
      res.status(403).json({error: "Forbidden"});
      return;
  }


  let application = await JobApplication.findOne({_id: req.params.id}).lean();
  let job_id = application.job_id;
  let job = await Job.findOne({_id: job_id}).lean();
  let max_positions = job.max_positions;

  let applications = await JobApplication.find({job_id: job_id, status: "Selected"});
  let count_positions = applications.length;

  if (count_positions === max_positions) {
    res.status(400).json({error: "All Positions filled"});
    return;
  }

  let newObj = req.body;
  if(req.body.status === "Selected") newObj.date_of_ac = new Date();
  const application_id = req.params.id;

  JobApplication
    .findByIdAndUpdate(
      application_id,
      newObj,
      {new: true},
      (err, job) => {
        if(err) {
            res.status(500).json(err);
            return ;
        } else {
            res.json(job);
            return ;
        }
    }
    )
}))



// @route: /recruiter/myjobs/delete/:id
// @desc : DELETE job
// @access: Private
router.delete('/myjobs/delete/:id', protect( async (req, res, result) => {
  if (result.type != process.env.USER_RECRUITER) {
      res.status(403).json({error: "Forbidden"});
      return;
  }
 
  const job_id = req.params.id;
  
  await JobApplication 
          .deleteMany({job_id: job_id});
  
  await Job
    .findByIdAndDelete(
      job_id,
      (err, job) => {
        console.log(job);
        if(err) {
            res.status(500).json(err);
            return ;
        } else {
            res.json(job);
            return ;
        }
    }
    )
}))

// @route: /recruiter/myemployees
// @desc : GET Employees from his jobs
// @access: Private
router.get('/myemployees', protect( async (req, res, result) => {
  if (result.type != process.env.USER_RECRUITER) {
      res.status(403).json({error: "Forbidden"});
      return;
  }
  const recruiter_id = result.id;
  
  let myJobs = await Job.find({recruiter_id: recruiter_id}).lean()
                  

  let ret = []
  await asyncforEach(myJobs, async (job, id) => {
      const applications = await JobApplication 
                                    .find({job_id: job._id})
                                    .lean()
      
      
      await asyncforEach(applications, async (application, id) => {
              if (application.status !== "Selected") return;
              let applicant = await Applicant.findOne({_id: application.applicant_id}).lean()
              let now = {}
              now.application_id = application._id;
              now.applicant_name = applicant.name;
              now.title = job.title;
              now.date_of_ac = application.date_of_ac;
              now.job_type = job.job_type;
              now.rating = application.applicant_rating;
              ret.push(now);
            })
  })
  res.json(ret);
}))

// @route: /recruiter/myemployees/rate/:id
// @desc :  Rate his employees
// @access: Private
router.put('/myemployees/rate/:id', protect( async (req, res, result) => {
  if (result.type != process.env.USER_RECRUITER) {
      res.status(403).json({error: "Forbidden"});
      return;
  }
  const application_id = req.params.id;

  let application = await JobApplication
                        .findOne({_id: application_id})
                        .lean()

  application.applicant_rating = parseInt(req.body.rating);

  await JobApplication
    .findByIdAndUpdate(application._id,
       application,
      {new: true},
      (err, application) => {
        if(err) {
            res.status(500).json(err);
            return ;
        } else {
            res.json(application);
            return ;
        }
    })

  let addedRating = req.body.rating;
  let totalRating = 0, totalRecs = 0;
  let applicant_id = application.applicant_id;

  let applications = await JobApplication
                              .find({applicant_id: applicant_id, applicant_rating: {$ne: -1}})
    
  await asyncforEach(applications, (application, id) => {
    totalRating += application.applicant_rating;
    totalRecs += 1;
  })                      
  
  let newRating = Math.round((totalRating + addedRating)/(1+totalRecs));

  await Applicant
          .findByIdAndUpdate(
            applicant_id,
            {rating: newRating},
            {new: true}
          )
  
}))

module.exports = router;

