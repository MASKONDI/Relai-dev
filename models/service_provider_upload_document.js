const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Create Schema
const ServiceProviderUploadDocsSchema = new Schema({
  //should be auto generated   
  spuds_docs_id: {
    type: String,
  },
  spuds_customer_id: {
    type: Schema.Types.ObjectId,
    ref: "customers"
  },
  spuds_property_id: {
    type: Schema.Types.ObjectId,
    ref: "properties"
  },
  spuds_document_name: {
    type: String,
  },
  spuds_document_file: {
    data: Buffer,
    contantType: String
  },
  spuds_document_size: {
    type: String,
  },

  spuds_document_type: {
    type: String,
    enum: ['image', 'video', 'pdf', 'doc', 'txt']
  },
  spuds_verification_status: {
    type: String,
    enum: ['pending', 'accept', 'reject'],
    default: 'pending'
  },
  spuds_created_at: {
    type: Date,
    default: Date.now
  },
  spuds_updated_at: {
    type: Date,
  },
  spuds_deleted_at: {
    type: Date
  },
  
  //==============================task fild==================
  spuds_phase_name: {
    type: String,
    },
    spuds_task_name: {
    type: String,
    },
    spuds_task_id: {
    type: Schema.Types.ObjectId,
    ref: 'property_professional_task'
    },
    spuds_service_provider_id: {
    type: Schema.Types.ObjectId,
    ref: "service_provider"
    },
    spuds_phase_flag: {
    type: String,
    }
});

module.exports = ServiceProvideruploaddocs = mongoose.model('ServiceProvideruploaddocs', ServiceProviderUploadDocsSchema);

