const Validator = require('validator')
const isEmpty = require('is-empty')

const ValidateProfileUpdateInput = (data) => {
  let errors = {};
  data.name = !isEmpty(data.name) ? data.name.toString() : ""
  data.email = !isEmpty(data.email) ? data.email.toString() : ""

  // Name checks
  if (Validator.isEmpty(data.name)) {
    errors.name = "Name field is required";
    }

  // Email checks
  if (Validator.isEmpty(data.email)) {
      errors.email = "Email field is required";
  } else if (!Validator.isEmail(data.email)) {
      errors.email = "Email is invalid";
  }

  data.institute && data.institute.forEach((item, index) => {
    data.institute[index].name = !isEmpty(data.institute[index].name) ? data.institute[index].name : ""
    data.institute[index].start_year = !isEmpty(data.institute[index].start_year) ? data.institute[index].start_year.toString().substring(0,4) : ""
    data.institute[index].end_year = !isEmpty(data.institute[index].end_year) ? data.institute[index].end_year.toString().substring(0,4) : ""
  })


  data.institute && data.institute.forEach((item, id) => {
    let education_error = {}
    let isError = false;
    if(Validator.isEmpty(item.name)) {
        education_error.name = "Institute name field is not there"
        isError = true;
    }
    if(Validator.isEmpty(item.start_year)) {
        education_error.start_year = "Institute start year field is not there"
        isError = true;
      } else if (!Validator.isInt(item.start_year)) {
      education_error.start_year = "Institute start year field is not a valid year"
      isError = true;
    }
    if(!Validator.isEmpty(item.end_year) && !Validator.isInt(item.end_year)) {
      education_error.end_year = "Institute end year field is not a valid year"
      isError = true;
    } 
    if(isError === true) {
      if(!("education" in errors)) errors.education = {}
      errors.education[id] = education_error;
    }
  })
  return {
    errors,
    isValid: isEmpty(errors)
  }
}

module.exports = ValidateProfileUpdateInput