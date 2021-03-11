const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Create Schema
const SubmitProposalSchema = new Schema({
  //should be auto generated by mongodb
  sps_proposal_id: {
    type: String,
  },
  sps_customer_id: {
    type: Schema.Types.ObjectId,
    ref: "customers"
  },
  sps_service_provider_id: {
    type: Schema.Types.ObjectId,
    ref: "serviceProviders"
  },
  sps_property_id: {
    type: Schema.Types.ObjectId,
    ref: "properties"
  },
  sps_status: {
    type: String,
    enum: ['pending', 'accept', 'reject'],
    default: 'pending'
  },
  sps_filename: { type: String },
  sps_start_date: { type: String },
  sps_end_date: { type: String },
  sps_payment_mode: { type: String },
  sps_extra_notes: { type: String },
  sps_milestone_array: {
    type: Array,
  },
  sps_date: {
    type: Array,
  },
  sps_created_at: {
    type: Date,
    default: Date.now
  },
  sps_updated_at: {
    type: Date
  },
  sps_deleted_at: { type: Date },

  sps_deleted: {
    type: String,
    enum: ['0', '1']
  },

})
module.exports = submit_proposal = mongoose.model('submit_proposal', SubmitProposalSchema);
