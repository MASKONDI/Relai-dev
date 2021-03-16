
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Create Schema
const NotificationsSchema = new Schema({

  //should be objectID genrated by MongoDB
  ns_id: {
    type: String
  },
  ns_title: {

  },
  ns_sender: {
    type: Schema.Types.ObjectId,
    //customerId or ServiceProviderID
  },
  ns_receiver: {
    type: Schema.Types.ObjectId,
    //customerId or ServiceProviderID
  },
  ns_sender_type: {
    type: String,
    enum: ['customer', 'service_provider'],
  },
  ns_receiver_type: {
    type: String,
    enum: ['customer', 'service_provider'],
  },

  ns_date: {
    type: String,
  },

  ns_read_status: {
    type: String,
    enum: ['read', 'unread']
  },

  ns_created_at: {
    type: Date,
    default: Date.now
  },
  ns_updated_at: {
    type: Date
  },
  ns_deleted_at: {
    type: Date
  },
});
module.exports = notifications = mongoose.model('notifications', NotificationsSchema);