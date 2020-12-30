const Validator = require('validator');
const isEmpty = require('./is-empty');

module.exports = function validateCustomerSigninInput(req) {
  let errors = {};

  req.cus_email_id = !isEmpty(req.cus_email_id) ? req.cus_email_id : '';
  req.cus_password = !isEmpty(req.cus_password) ? req.cus_password : '';


  //EmailId Validation
  if (Validator.isEmpty(req.cus_email_id)) {
    errors.cus_email_id = 'Email field is required';
  }
  if (!Validator.isEmail(req.cus_email_id)) {
    errors.cus_email_id = 'Email is invalid';
  }



  //Password Validation
  if (Validator.isEmpty(req.cus_password)) {
    errors.cus_password = 'Password field is required';
  }

  if (!Validator.isLength(req.cus_password, { min: 6, max: 30 })) {
    errors.cus_password = 'Password must be at least 6 characters';
  }


  return {
    errors,
    isValid: isEmpty(errors)
  };
};
