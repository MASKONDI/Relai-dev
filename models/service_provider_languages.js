const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Create Schema
const ServiceProviderLanguageSchema = new Schema({

  //should be mongodb generated object Id
  spls_id: {
    type: String,
  },
  spls_service_provider_id: {
    type: Schema.Types.ObjectId,
    ref: "serviceProviders"
  },

  spls_language: {
    type: String,
    enum: ['english', 'german', 'french', 'spanish']
  },
  spls_language_proficiency_level: {
    type: String,
    enum: ['level1', 'level2', 'level3', 'level4', 'level5']
  },
  spls_created_at: {
    type: Date,
    default: Date.now,
  },
  spls_updated_at: {
    type: Date,
  },
  spls_deleted_at: {
    type: Date,
  }
});
module.exports = ServiceProviderLanguages = mongoose.model('serviceProviderLanguages', ServiceProviderLanguageSchema);