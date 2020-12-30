const Validator = require('validator');
const isEmpty = require('./is-empty');

module.exports = function validateServiceProviderSigninInput(req) {
  let errors = {};

  req.sps_email_id = !isEmpty(req.sps_email_id) ? req.sps_email_id : '';
  req.sps_password = !isEmpty(req.sps_password) ? req.sps_password : '';


  //EmailId Validation
  if (Validator.isEmpty(req.sps_email_id)) {
    errors.sps_email_id = 'Email field is required';
  }
  if (!Validator.isEmail(req.sps_email_id)) {
    errors.sps_email_id = 'invalid email';
  }

  //Password Validation
  if (Validator.isEmpty(req.sps_password)) {
    errors.sps_password = 'Password field is required';
  }
  if (!Validator.isLength(req.sps_password, { min: 6, max: 30 })) {
    errors.sps_password = 'Password must be at least 6 characters';
  }


  return {
    errors,
    isValid: isEmpty(errors)
  };
};
