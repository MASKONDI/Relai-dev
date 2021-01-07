const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Create Schema
const ServiceProviderPortfolioSchema = new Schema({

  //should be mongo db generated-ObjectId()  
  spps_porfolio_id: {
    type: String
  },

  spps_service_provider_id: {
    type: Schema.Types.ObjectId,
    ref: "serviceProviders"
  },
  spps_filename: {
    type: String,
  },
  spps_type: {
    type: String,
    enum: ['image', 'video']
  },
  spps_file: {
    data: Buffer,
    contentType: String
  },
  spps_created_at: {
    type: Date,
    default: Date.now,
  },
  spps_updated_at: {
    type: Date,
  },
  spps_deleted_at: {
    type: Date,
  },

});

module.exports = ServiceProviderPortfolio = mongoose.model('serviceProviderPortfolio', ServiceProviderPortfolioSchema);