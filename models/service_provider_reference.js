const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Create Schema
const ServiceProviderReferenceSchema = new Schema({

  //should be mongodb generated objectId
  rs_reference_id: {
    type: String,
  },

  rs_service_provider_id: {
    type: Schema.Types.ObjectId,
    ref: "serviceProviders"
  },

  rs_reference_fullname: {
    type: String,
  },

  rs_reference_type: {
    type: String,
    enum: ['customer', 'service_provider']
  },
  rs_reference_job_title: {
    type: String,
  },
  rs_reference_organisation: {
    type: String,
  },
  rs_reference_postal_code: {
    type: String,
  },
  rs_reference_address: {
    type: String,
  },
  rs_reference_telePhoneNumber: {
    type: String,
  },
  rs_reference_emailid: {
    type: String,
  },

  rs_option_obtain_reference: {
    type: String,
    enum: ['yes', 'no']
  },
  rs_reference_relationship: {
    type: String,
  },
  rs_created_at: {
    type: Date,
    default: Date.now,
  },
  rs_updated_at: {
    type: String,
  },
  rs_deleted_at: {
    type: String,
  },

});
module.exports = ServiceProviderReference = mongoose.model('sp_reference', ServiceProviderReferenceSchema);
