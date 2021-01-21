const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Create Schema
const MessageSchema = new Schema({
  //should be auto generated from mongo
  sms_message_id: {
    type: String,
  },
  sms_property_id: {
    type: Schema.Types.ObjectId,
    ref: "properties"
  },
  sms_sender_id: {
    type: Schema.Types.ObjectId, //store customer_ID or service_provider_ID
  },
  sms_receiver_id: {
    type: Schema.Types.ObjectId, //store customer_ID or service_provider_ID
  },
  sms_sender_type: {
    type: String,
    enum: ['customer', 'service_provider'],
  },
  sms_receiver_type: {
    type: String,
    enum: ['customer', 'service_provider']
  },
  sms_message: {
    type: String,
  },
  sms_msg_Date: {
    type: Date
  },
  sms_read_status: {
    type: String,
    enum: ['read', 'unread'],
    default: 'unread'
  },
  sms_created_at: {
    type: Date,
    default: Date.now
  },
  sms_updated_at: {
    type: Date,
  },
  sms_deleted_at: {
    type: Date
  },
});
module.exports = message = mongoose.model('message', MessageSchema);
