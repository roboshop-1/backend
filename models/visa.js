const mongoose = require('mongoose');

const visaSchema= mongoose.Schema({
    card:number,
    cvv:number,
});


const visa = mongoose.model('Visa',visaSchema);

module.exports= visa;