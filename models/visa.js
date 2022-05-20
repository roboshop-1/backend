const mongoose = require('mongoose');

const visaSchema= mongoose.Schema({
    card:Number,
    cvv:Number
});


const visa = mongoose.model('Visa',visaSchema);

module.exports= visa;