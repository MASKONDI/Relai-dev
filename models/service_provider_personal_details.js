const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Create Schema
const ServiceProviderPersonalDetailsSchema = new Schema({

  //should be mongoDb generated objectID
  spods_service_other_detail_id: {
    type: String,
  },
  spods_service_provider_id: {
    type: Schema.Types.ObjectId,
    ref: "serviceProviders"
  },
  spods_surname: {
    type: String,

  },
  spods_fornames: {
    type: String,

  },
  spods_preferred_title: {
    type: String,
    enum: ['mr', 'miss', 'mrs'],

  },
  spods_former_surnames: {
    type: String,

  },
  spods_address: {
    type: String,
  },
  spods_dob: {
    type: Date,

  },
  spods_nationality: {
    type: String,

  },
  spods_postcode: {
    type: String,

  },
  spods_home_telephone_number: {
    type: String,

  },
  spods_postcode_covered: {
    type: String,

  },
  spods_start_working_time: {
    type: String,
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
module.exports = personal_details = mongoose.model('sp_personal_details', ServiceProviderPersonalDetailsSchema);
