const mongoose = require('mongoose');

const panierSchema= mongoose.Schema({
    name:String,
    price:Number,
     solde : Boolean ,
    remise : Number ,
    new_price : Number ,
    quantity:Number,
    total : Number ,
    img:String,
    imgg : String ,
    stock : String,
    user : String
 
});

const panier = mongoose.model('Panier',panierSchema);

module.exports= panier;


