const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Create Schema
const ServiceProviderPlanSchema = new Schema({

  //should be mongo db generated-ObjectId()  
  sppls__id: {
    type: String
  },
  sppls_service_provider_id: {
    type: Schema.Types.ObjectId,
    ref: "serviceProviders"
  },
  sppls_plan_id: {
    type: Schema.Types.ObjectId,
    ref: "plan"
  },
  sppls_status: {
    type: String,
    enum: ['active', 'inactive']
  },
  sppls_created_at: {
    type: Date,
    default: Date.now,
  },
  sppls_updated_at: {
    type: Date,
  },
  sppls_deleted_at: {
    type: Date,
  },

});

module.exports = ServiceProviderPlan = mongoose.model('serviceProviderPlan', ServiceProviderPlanSchema);