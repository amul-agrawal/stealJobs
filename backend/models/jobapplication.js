
const mongoose = require('mongoose');

const JobApplicationSchema = new mongoose.Schema({
    applicant_id: {
        type: mongoose.Schema.Types.ObjectID,
        required: true,
        ref: 'Applicant',
    },
    job_id: {
        type: mongoose.Schema.Types.ObjectID,
        required: true,
        ref: 'Jobs'
    },
    status: {
        type: String,
        enum: ["Applied", "Shortlisted", "Selected", "Rejected"],
        default: "Applied" 
    },
    sop: {
        type: String,
        required: true,
    },
    date: { // date of post
        type: Date,
        default: Date.now()
    },
    date_of_ac: {
        type: Date,
        default: "9999-12-31"
    },
    rating: {  // applicant -> job
        type: Number,
        default: -1
    }, 
    applicant_rating: { // employer -> applicant
        type: Number,
        default: -1
    }
});

module.exports = JobApplication = mongoose.model('JobApplications', JobApplicationSchema);
