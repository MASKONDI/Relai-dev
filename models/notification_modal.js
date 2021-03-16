
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Create Schema
const NotificationsSchema = new Schema({

//should be objectID genrated by MongoDB
ns_id: {
    type: String
},
ns_title: {
    type: String
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
ns_property_id: {
    type: Schema.Types.ObjectId,
},
ns_date: {
    type: String,
},
ns_read_status: {
    type: String,
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
}
});
module.exports = notifications = mongoose.model('notifications', NotificationsSchema);