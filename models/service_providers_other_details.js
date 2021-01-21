const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Create Schema
const ServiceProviderOtherDetailsSchema = new Schema({

  //should be mongoDb generated objectID
  spods_service_detail_id: {
    type: String,
  },
  spods_service_provider_id: {
    type: Schema.Types.ObjectId,
    ref: "serviceProviders"
  },

  spods_option_work_permit_for_uk: {
    type: String,
    enum: ['yes', 'no'],

  },
  spods_option_criminal_convictions: {
    type: String,
    enum: ['yes', 'no'],

  },
  spods_option_uk_driving_licence: {
    type: String,
    enum: ['yes', 'no'],

  },
  spods_details_of_convictions: {
    type: String,

  },
  spods_professional_body: {
    type: String,

  },
  spods_date_registered: {
    type: Date,

  },
  spods_membership_number: {
    type: String,

  },
  spods_membership_no_date_registered: {
    type: Date,
  },
  spods_other_relevant_qualification: {
    type: String,
  },
  spods_option_pl_claims: {
    type: String,
    enum: ['yes', 'no'],
  },
  spods_pl_claim_details: {
    type: String,

  },
  spods_option_pl_cover: {
    type: String,
    enum: ['yes', 'no'],
  },
  spods_name_insurer: {
    type: String,

  },
  spods_boker_details: {
    type: String,

  },
  spods_level_of_cover: {
    type: String,

  },
  spods_renewal_date: {
    type: Date,

  },
  spods_created_at: {
    type: Date,
    default: Date.now
  },
  spods_updated_at: {
    type: Date,

  },
  spods_deleted_at: {
    type: Date,

  },

});
module.exports = ServiceProviderOtherDetails = mongoose.model('sp_other_details', ServiceProviderOtherDetailsSchema);
