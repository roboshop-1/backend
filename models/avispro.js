const mongoose = require('mongoose');

const avisproSchema= mongoose.Schema({
    name:String,
    product:String,
    review: String,
    datails:String,
    star : Number
});


const avispro = mongoose.model('Avispro',avisproSchema);

module.exports= avispro;