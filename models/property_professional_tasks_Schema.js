const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Create Schema
const PropertyProfessinoalTaskSchema = new Schema({
    ppts_id: { 
        type: Number,
        //required:true 
    },
    ppts_property_id: {
    type: Schema.Types.ObjectId,
    required:true,
    ref: "properties"
  },
  ppts_user_id: {
    //type: Schema.Types.ObjectId,
    type: Array,
    required:true,
    ref: "customers"
  },
  ppts_phase_id:{
      type: String,
     // required:true

  },
  ppts_phase_name:{
    type: String,
    required:true

},
  ppts_task_name:{
    type:String,
    required:true
  },
  ppts_assign_to: {
    //type: Schema.Types.ObjectId,
    type: Array,
    ref: "service_provider"
   
  },
  ppts_assign_user_type: {
    type: String,
    enum: ['customer', 'service_provider'],
    default:'service_provider'
    
  },
  ppts_due_date: {
    //type: String,
    type: Array,
    required:true
  },
  ppts_note:{
   type: Array,
   //type:String
  },
  ppts_phase_flag:{
    type:String
   },
  ppts_task_status:{
    type: Array,
    
  },
  ppts_created_at: {
    type: Date,
    default: Date.now
  },
  ppts_updated_at: {
    type: Date
  },
  ppts_deleted_at: {
    type: Date
  },
  ppts_is_active_user_flag:{
    type: String,
    enum: ['buyer', 'seller','renovator'],
    default: 'buyer'
  },
  ppts_is_remove_task:{
    type: Array,
   
  },
  ppts_is_delete:{
    type: String,
    default:'no'
  }
});
module.exports = PropertyProfessinoalTask = mongoose.model('property_professional_task', PropertyProfessinoalTaskSchema);