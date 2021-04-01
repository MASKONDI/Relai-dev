const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Create Schema
const DocumentDownloadSchema = new Schema({
  //should be auto generated by mongodb
  dd_permission_id: {
    type: String,
  },
  dd_uploaded_by_id: {
    type: Schema.Types.ObjectId,
    ref: "customers"
  },
  dd_downloaded_by_id: {
    type: Schema.Types.ObjectId,
    ref: "serviceProviders"
  },
  dd_document_id: {
    type: Schema.Types.ObjectId,
    ref: "customersuploaddocs"
  },
  dd_download_status:{
    type: String,
  },
  dd_created_at: {
    type: Date,
    default: Date.now
  },
  dd_updated_at: {
    type: Date
  },
  dd_deleted_at: { type: Date },
})
module.exports = docspermission = mongoose.model('download_document', DocumentDownloadSchema);