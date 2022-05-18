const mongoose = require('mongoose');

const feedbackSchema= mongoose.Schema({
    name:String,
    email:String,
    phone:Number,
    subject: String,
    message:String,
    visibility: {
        type: Boolean,
        default : false
      },
    done: {
      type: Boolean,
      default : false
     }
});


const feedback = mongoose.model('Feedback',feedbackSchema);

module.exports= feedback;