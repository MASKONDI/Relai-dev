const Validator = require('validator');
const isEmpty = require('./is-empty');

module.exports = function validateServiceProviderRegisterInput(req) {
  let errors = {};
  console.log("req.body is:", req);

  req.sps_fullname = !isEmpty(req.sps_fullname) ? req.sps_fullname : '';
  req.sps_email_id = !isEmpty(req.sps_email_id) ? req.sps_email_id : '';
  req.sps_phone_number = !isEmpty(req.sps_phone_number) ? req.sps_phone_number : '';
  req.sps_password = !isEmpty(req.sps_password) ? req.sps_password : '';
  req.confirmPassword = !isEmpty(req.confirmPassword) ? req.confirmPassword : '';
  req.sps_address = !isEmpty(req.sps_address) ? req.sps_address : '';
  req.sps_country_id = !isEmpty(req.sps_country_id) ? req.sps_country_id : '';
  req.sps_city = !isEmpty(req.sps_city) ? req.sps_city : '';

  //name Validation
  if (Validator.isEmpty(req.sps_fullname)) {
    errors.sps_fullname = "Name field is required";
  }
  if (!Validator.isLength(req.sps_fullname, { min: 2, max: 30 })) {
    errors.sps_fullname = 'Name must be between 2 and 30 characters';
  }


  //EmailId Validation
  if (Validator.isEmpty(req.sps_email_id)) {
    errors.sps_email_id = 'Email field is required';
  }
  if (!Validator.isEmail(req.sps_email_id)) {
    errors.sps_email_id = 'Email is invalid';
  }

  //Phone Number Validation 
  if (!Validator.isNumeric(req.sps_phone_number)) {
    errors.sps_phone_number = "PhoneNumber must be  Number";
  }

  if (!Validator.isLength(req.sps_phone_number, { min: 10, max: 12 })) {
    errors.sps_phone_number = "PhoneNumber must be 10 Numeric characters";
  }

  //Password Validation
  if (Validator.isEmpty(req.sps_password)) {
    errors.sps_password = 'Password field is required';
  }

  if (!Validator.isLength(req.sps_password, { min: 6, max: 30 })) {
    errors.sps_password = 'Password must be at least 6 characters';
  }

  //confirm Password Validations
  if (Validator.isEmpty(req.confirmPassword)) {
    errors.confirmPassword = 'Confirm Password field is required';
  }
  if (!Validator.equals(req.sps_password, req.confirmPassword)) {
    errors.confirmPassword = 'Passwords must match';
  }

  //Address validation
  if (Validator.isEmpty(req.sps_address)) {
    errors.sps_address = "Address field is required";
  }
  if (!Validator.isLength(req.sps_address, { min: 2, max: 100 })) {
    errors.sps_address = 'Address must be between 2 and 100 characters';
  }

  //Country validation
  if (Validator.isEmpty(req.sps_country_id)) {
    errors.sps_country_id = "Country Name field is required";
  }
  if (!Validator.isLength(req.sps_country_id, { min: 2, max: 30 })) {
    errors.sps_country_id = 'Country Name must be between 2 and 30 characters';
  }

  //City validation
  if (Validator.isEmpty(req.sps_city)) {
    errors.sps_city = "City Name field is required";
  }
  if (!Validator.isLength(req.sps_city, { min: 2, max: 30 })) {
    errors.sps_city = 'City Name must be between 2 and 30 characters';
  }

  return {
    errors,
    isValid: isEmpty(errors)
  };
};
