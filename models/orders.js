const mongoose = require('mongoose');

const orderSchema= mongoose.Schema({
    date:Date,
    number:Number,
    total_prices:Number,
    products:Array,
    user: String,
    status: {
        type: Boolean,
        default : false
      }
   
});


const order = mongoose.model('Order',orderSchema);

module.exports= order;