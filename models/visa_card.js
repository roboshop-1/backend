const mongoose = require('mongoose');

const visacardSchema= mongoose.Schema({
    card:Number,
    cvv:Number
});


const visa_card = mongoose.model('Visa',visacardSchema);

module.exports= visa_card;