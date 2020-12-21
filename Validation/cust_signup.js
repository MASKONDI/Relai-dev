const Validator = require('validator');
const isEmpty = require('./is-empty');

module.exports = function validateCust_RegisterInput(data) {
  let errors = {};

  data. = !isEmpty(data.) ? data. : '';
  data. = !isEmpty(data.) ? data. : '';
  data. = !isEmpty(data.) ? data. : '';
  data.password = !isEmpty(data.password) ? data.password : '';
  data.password2 = !isEmpty(data.password2) ? data.password2 : '';

  if (!Validator.isLength(data., { min: 2, max: 30 })) {
    errors. = ' must be between 2 and 30 characters';
  }

  if (Validator.isEmpty(data.)) {
    errors. = ' field is required';
  }

  if (Validator.isEmpty(data.)) {
    errors. = ' field is required';
  }

  if (!Validator.isNumeric(data.)) {
    errors. = " must be  Number";
  }

  if (!Validator.isLength(data., { min: 10, max: 10 })) {
    errors. = " must be 10 Numeric characters";
  }

  if (!Validator.is(data.)) {
    errors. = ' is invalid';
  }

  if (Validator.isEmpty(data.password)) {
    errors.password = 'Password field is required';
  }

  if (!Validator.isLength(data.password, { min: 6, max: 30 })) {
    errors.password = 'Password must be at least 6 characters';
  }

  if (Validator.isEmpty(data.password2)) {
    errors.password2 = 'Confirm Password field is required';
  }

  if (!Validator.equals(data.password, data.password2)) {
    errors.password2 = 'Passwords must match';
  }

  return {
    errors,
    isValid: isEmpty(errors)
  };
};
