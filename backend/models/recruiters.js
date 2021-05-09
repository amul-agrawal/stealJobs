
const mongoose = require('mongoose');

const RecruiterSchema = new mongoose.Schema({
	name: {
		type: String,
		required: true
	},
	email: {
		type: String,
		required: true,
		unique: true
	},
	phone: {
		type: String,
	},
	password: {
		type: String,
		required: true
	},
	image: {
		type: String
	},
	bio: {
			type: String,
			default: ""
	}
});

module.exports = Recruiter = mongoose.model('Recruiters', RecruiterSchema);

