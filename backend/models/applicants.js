
const mongoose = require('mongoose');

const EducationSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    start_year: {
        type: Date,
        required: true
    },
    end_year: {
        type: Date,
    }
});

const ApplicantSchema = new mongoose.Schema({
    name: {
		type: String,
		required: true
	},
	email: {
		type: String,
        required: true,
        unique: true
    },
    password: {
		type: String,
		required: true
    },
    image: {
        type: String,
    },
    institute: {
        type: [EducationSchema],
    },
    skills: {
        type: [String],
    },
    rating: {
        type: Number,
        min: 0,
        max: 5,
        default: 0
    }
});

module.exports = Applicant = mongoose.model('Applicants', ApplicantSchema);
