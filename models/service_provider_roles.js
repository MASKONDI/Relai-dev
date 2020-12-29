const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Create Schema
const ServiceProviderRolesSchema = new Schema({

  //should be mongodb generated object_id 
  sprs_role_id: {
    type: String,
  },
  sprs_role_name: {
    type: String,
    required: true,
  },
  sprs_role_status: {
    type: String,
    required: true,
  },
  sprs_created_at: {
    type: Date,
    default: Date.now,
  },
  sprs_updated_at: {
    type: Date,
  },
  sprs_deleted_at: {
    type: Date,
  },
  sprs_deleted: {
    type: String,
    enum: ['0', '1'],
    default: '0'
  },
});
module.exports = ServiceProviderRoles = mongoose.model('serviceProviderRoles', ServiceProviderRolesSchema);
