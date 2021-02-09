const Validator = require('validator');
const isEmpty = require('./is-empty');

module.exports = function validateCustomerRegisterInput(req) {
  let errors = {};

  req.cus_firstname = !isEmpty(req.cus_firstname) ? req.cus_firstname : '';
  req.cus_email_id = !isEmpty(req.cus_email_id) ? req.cus_email_id : '';
  req.cus_phone_number = !isEmpty(req.cus_phone_number) ? req.cus_phone_number : '';
  req.cus_password = !isEmpty(req.cus_password) ? req.cus_password : '';
  req.confirmPassword = !isEmpty(req.confirmPassword) ? req.confirmPassword : '';
  req.cus_address = !isEmpty(req.cus_address) ? req.cus_address : '';
  //req.cus_country_id = !isEmpty(req.country) ? req.country : '';
  //req.cus_city = !isEmpty(req.city) ? req.city : '';
  //req.cus_state = !isEmpty(req.state) ? req.state : '';

  //name Validation
  if (Validator.isEmpty(req.cus_firstname)) {
    errors.cus_firstname = "Name field is required";
  }
  if (!Validator.isLength(req.cus_firstname, { min: 2, max: 30 })) {
    errors.cus_firstname = 'Name must be between 2 and 30 characters';
  }


  //EmailId Validation
  if (Validator.isEmpty(req.cus_email_id)) {
    errors.cus_email_id = 'Email field is required';
  }
  if (!Validator.isEmail(req.cus_email_id)) {
    errors.cus_email_id = 'Email is invalid';
  }

  //Phone Number Validation 
  if (!Validator.isNumeric(req.cus_phone_number)) {
    errors.cus_phone_number = "PhoneNumber must be  Number";
  }

  if (!Validator.isLength(req.cus_phone_number, { min: 10, max: 12 })) {
    errors.cus_phone_number = "PhoneNumber must be 10 Numeric characters";
  }

  //Password Validation
  if (Validator.isEmpty(req.cus_password)) {
    errors.cus_password = 'Password field is required';
  }

  if (!Validator.isLength(req.cus_password, { min: 6, max: 30 })) {
    errors.cus_password = 'Password must be at least 6 characters';
  }

  //confirm Password Validations
  if (Validator.isEmpty(req.confirmPassword)) {
    errors.confirmPassword = 'Confirm Password field is required';
  }
  if (!Validator.equals(req.cus_password, req.confirmPassword)) {
    errors.confirmPassword = 'Passwords must match!';
  }

  //Address validation
  if (Validator.isEmpty(req.cus_address)) {
    errors.cus_address = "Address field is required";
  }
  if (!Validator.isLength(req.cus_address, { min: 2, max: 100 })) {
    errors.cus_address = 'Address must be between 2 and 100 characters';
  }

  // //Country validation
  // if (Validator.isEmpty(req.cus_country_id)) {
  //   errors.cus_country_id = "Country Name field is required";
  // }
  // if (!Validator.isLength(req.cus_country_id, { min: 2, max: 30 })) {
  //   errors.cus_country_id = 'Country Name must be between 2 and 30 characters';
  // }

  // //City validation
  // if (Validator.isEmpty(req.cus_city)) {
  //   errors.cus_city = "City Name field is required";
  // }
  // if (!Validator.isLength(req.cus_city, { min: 2, max: 30 })) {
  //   errors.cus_city = 'City Name must be between 2 and 30 characters';
  // }

  return {
    errors,
    isValid: isEmpty(errors)
  };
};
