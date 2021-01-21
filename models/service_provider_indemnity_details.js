
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Create Schema
const ServiceProviderIndemnityDetailsSchema = new Schema({

  //should be mongoDb generated objectID
  spods_service_detail_id: {
    type: String,
  },
  spods_service_provider_id: {
    type: Schema.Types.ObjectId,
    ref: "serviceProviders"
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
module.exports = indemnity_details = mongoose.model('sp_indemnity_details', ServiceProviderIndemnityDetailsSchema);

