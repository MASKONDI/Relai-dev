const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Create Schema
const PlanSchema = new Schema({

  //should be mongodb generated object_id
  ps_plan_id: {
    type: String,
  },
  ps_plan_name: {
    type: String,
    required: true,
  },
  ps_plan_amount: {
    type: String,
    required: true,
  },
  ps_plan_description: {
    type: String,
    required: true,
  },
  ps_plan_status: {
    type: String,
    enum: ['active', 'inactive'],
  },
  ps_created_at: {
    type: Date,
    default: Date.now,
  },
  ps_updated_at: {
    type: Date,
  },
  ps_deleted_at: {
    type: Date,
  },

});
module.exports = plan = mongoose.model('plan', PlanSchema);
