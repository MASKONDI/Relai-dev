const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Create Schema
const CustomerSchema = new Schema({

  //should be auto-incremented
  cus_customer_id: {
    type: Number,
    required: true,
  },

  cus_fullname: {
    type: String,
    required: true,
  },
  cus_unique_code: {
    type: String,

  },
  cus_emailid: {
    type: String,
    required: true,
  },
  cus_phone_number: {
    type: String,
    required: true,
  },
  cus_address: {
    type: String,
    required: true,
  },
  cus_country_id: {
    type: String,
    required: true,
  },
  cus_city: {
    type: String,
    required: true,
  },
  cus_password: {
    type: String,
    required: true,
  },
  cus_otp: {
    type: String,

  },
  cus_otp_expie_time: {
    type: String,

  },
  cus_email_verification_status: {
    type: String,
    enum: ['DEFAULT', 'TRUE'],
    default: 'TRUE'
  },
  cus_kyc_status: {
    type: String,
    enum: ['DEFAULT', 'TRUE'],
    default: 'TRUE'
  },
  cus_status: {

    type: String,
    enum: ['active', 'inactive'],
    default: 'active',
  },
  cus_created_at: {
    type: Date.now(),
  },
  cus_updated_at: {
    type: Date,
  },
  cus_deleted_at: {
    type: Date,

  },
  cus_deleted: {
    type: String,
    enum: ['0', '1'],
    default: '0',

  },
  cus_admin_approval: {
    type: String,
    enum: ['pending', 'completed'],
    default: 'pending',
  }
});

module.exports = Customers = mongoose.model('customers', CustomerSchema);









