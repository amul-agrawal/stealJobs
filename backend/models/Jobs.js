
const mongoose = require('mongoose');

const JobSchema = new mongoose.Schema({
    recruiter_id: {
        type: mongoose.Schema.Types.ObjectID,
        required: true,
        ref: 'Recruiters'
    },
    title: {
		type: String,
		required: true
    },
    max_applications: {
        type: Number,
        required: true
    },
    max_positions: {
        type: Number,
        required: true
    },
	post_date:{
		type: Date,
        default: Date.now
    },
    deadline:{
		type: Date,
        required: true
    },
    skills_req: {
        type: [String],
        required: true
    },
    job_type: {
        type: String,
        enum: ["Part Time", "Full Time", "Work From Home"],
        required: true
    },
    duration: {
        type: Number,
        min: 0,
        max: 6,
        required: true
    },
    salary: {
        type: Number,
        required: true
    },
    rating: {
        type: Number,
        min: 0,
        max: 5,
        default: 0
    }
});
module.exports = Job = mongoose.model('Jobs', JobSchema);

