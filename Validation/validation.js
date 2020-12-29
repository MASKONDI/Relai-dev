// const Validator = require('validator');

// exports.userSignupValidator = (req, res, next) => {

//   //cus_fullname Validations
//   req.check("fullName", "Name is required").notEmpty();
//   req.check("fullName")
//     .isLength({ min: 2 })
//     .withMessage("FullName must contain at least 2 characters");

//   //Email Validation
//   req.check("email", "Email must be between 3 to 32 characters")
//     .matches(/.+\@.+\..+/)
//     .withMessage("Email must contain @")
//     .isLength({
//       min: 4,
//       max: 32
//     });
//   //Phone Number Validation
//   req.check("phoneNumber", "Phone Number is required").notEmpty();
//   req.check("phoneNumber").isLength({ min: 10, max: 12 }).withMessage("Phone number must contain at least 10 digits").matches(/\d/).withMessage("Phone Number must be a number");

//   //Password Validation
//   req.check("password", "Password is required").notEmpty();
//   req.check("password")
//     .isLength({ min: 6 })
//     .withMessage("Password must contain at least 6 characters")
//     .matches(/\d/)
//     .withMessage("Password must contain a number");

//   //confirm Password Validation
//   req.check("confirmPassword", "Confirm Password is required").notEmpty();
//   if (!Validator.equals(req.password, req.password2)) {
//     errors.password2 = 'Passwords must match';
//   }

//   //address validation
//   req.check("address", "Address is required").notEmpty();
//   req.check("address")
//     .isLength({ min: 2 })
//     .withMessage("Address must contain at least 2 characters");

//   //country Validation
//   req.check("country", "Country Name is required").notEmpty();
//   req.check("country")
//     .isLength({ min: 2 })
//     .withMessage("country name must contain at least 2 characters");

//   //City Validation 
//   req.check("city", "City Name is required").notEmpty();
//   req.check("city")
//     .isLength({ min: 2 })
//     .withMessage("city name must contain at least 2 characters");



//   const errors = req.validationErrors();
//   if (errors) {
//     const firstError = errors.map(error => error.msg)[0];
//     return res.status(400).json({ error: firstError });
//   }
//   next();
// };
