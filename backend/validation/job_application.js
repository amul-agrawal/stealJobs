const Validator = require("validator");
const isEmpty = require("is-empty");

function countWords(str) {
  return str.trim().split(/\s+/).length;
}

const validateApplyJobInput = data => {
  let errors = {};

  data.sop = !isEmpty(data.sop) ? data.sop.toString() : ""; 

  if(Validator.isEmpty(data.sop)) {
    errors.sop = "sop not passed"
  } else if (countWords(data.sop) > 250) {
    errors.sop = "SOP can't be more than 250 words"
  }

  return {
    errors,
    isValid: isEmpty(errors)
  }

}

module.exports = validateApplyJobInput 