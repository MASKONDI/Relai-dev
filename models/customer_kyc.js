const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Create Schema
const CustomerKycSchema = new Schema({

  //should be auto-incremented or we can use _id as a customer_id
  cks_id: {

  },
  cks_user_id: {
    type: Schema.Types.ObjectId,
    ref: "customers" //store customers_id or service_provider_id
  },

  cks_user_type: {
    type: String,
    enum: ['customer', 'service_provider'],
  },

  cks_document_name: {
    type: String
  },
  cks_document_file: {
    data: Buffer,
    contentType: String
  },
  cks_verification_status: {
    type: String,
    enum: ['pending', 'verified', 'failed'],
    default: 'pending',
  },
  cks_verified_by: {
    type: String,
    enum: ['support_ots', 'automated_api'],
    default: 'automated_api',
  },

  cks_created_at: {
    type: Date,
    default: Date.now()
  },
  cks_updated_at: {
    type: Date,
  },
  cks_deleted_at: {
    type: Date,
  },
  cks_is_active_user_flag: {
    type: String,
    enum: ['buyer', 'seller','renovator'],
    default: 'buyer'
  },

});

module.exports = customerskyc = mongoose.model('customerskyc', CustomerKycSchema);









