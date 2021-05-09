const Validator = require('validator')
const isEmpty = require('is-empty')

const ValidateRecruiterProfile = (data) => {
  let errors = {};
  data.name = !isEmpty(data.name) ? data.name.toString() : ""
  data.email = !isEmpty(data.email) ? data.email.toString() : ""
  data.phone = !isEmpty(data.phone) ? data.phone.toString() : ""
  data.bio = !isEmpty(data.bio) ? data.bio.toString() : ""

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

  if(!isEmpty(data.phone) && !Validator.isInt(data.phone)) {
    errors.phone = "Phone number should be a number";
  }

  return {
    errors,
    isValid: isEmpty(errors)
  }
}

module.exports = ValidateRecruiterProfile