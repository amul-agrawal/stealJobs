const Validator = require("validator");
const isEmpty = require("is-empty");

const validateJobInput = data => {
  let errors = {};

  data.title = !isEmpty(data.title) ? data.title.toString() : ""; 
  data.max_applications = !isEmpty(data.max_applications) ? data.max_applications.toString() : "";
  data.max_positions = !isEmpty(data.max_positions) ? data.max_positions.toString() : "";
  data.deadline = !isEmpty(data.deadline) ? data.deadline.toString() : "";
  data.skills_req = !isEmpty(data.skills_req) ? data.skills_req : "";
  data.job_type = !isEmpty(data.job_type) ? data.job_type : "";
  data.duration = !isEmpty(data.duration) ? data.duration.toString() : "";
  data.salary = !isEmpty(data.salary) ? data.salary.toString() : "";
  // data.rating = !isEmpty(data.rating) ? data.rating.toString() : "";

  if(Validator.isEmpty(data.title)) {
    errors.title = "Title not passed"
  }

  if(!Validator.isEmpty(data.deadline) && !Validator.isDate(data.deadline)) {
    errors.deadline = "deadline does not have correct format"
  } else if (!Validator.isDate(data.deadline)) {
    errors.deadline = "not a valid date"
  }
  
  if(isEmpty(data.skills_req)) {
    errors.skills_req = "skills_req not passed"
  } 

  if(Validator.isEmpty(data.job_type)) {
    errors.job_type = "job_type not passed"
  }
  
  if(Validator.isEmpty(data.max_applications)) {
    errors.max_applications = "max_applications not passed"
  } else if (!Validator.isInt(data.max_applications, {min: 1})) {
    errors.max_applications = "max_applications should be a number greater than 0."
  }

  if(Validator.isEmpty(data.max_positions)) {
    errors.max_positions = "max_positions not passed"
  } else if (!Validator.isInt(data.max_positions, {min: 1})) {
    errors.max_positions = "Postion should be a number greater than 0."
  }

  if (
    !Validator.isEmpty(data.max_applications) && !Validator.isEmpty(data.max_positions) && 
    Validator.isInt(data.max_applications) && Validator.isInt(data.max_positions) &&
    parseInt(data.max_applications) < parseInt(data.max_positions)
    ) {
      errors.max_positions = "Max Positions should be less than max applications";
    }

  if(Validator.isEmpty(data.duration)) {
    errors.duration = "duration not passed"
  } else if (!Validator.isInt(data.duration, {min: 0,max: 6})) {
    errors.duration = "Duration should be between 0 and 6."
  }

  if(Validator.isEmpty(data.salary)) {
    errors.salary = "salary not passed"
  } else if (!Validator.isInt(data.salary, {min: 0})) {
    errors.salary = "Salary must be minimum 0."
  }

  // if(Validator.isEmpty(data.rating)) {
  //   errors.rating = "rating not passed"
  // } else if (!Validator.isInt(data.rating, {min: 0, max: 5})) {
  //   errors.rating = "rating should be between 0 and 5"
  // }

  return {
    errors,
    isValid: isEmpty(errors)
  }

}

module.exports = validateJobInput 