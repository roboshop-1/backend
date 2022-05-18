
const mongoose = require('mongoose');

const productSchema= mongoose.Schema({
    name:String,
    price:Number,
    quantity : Number ,
    categorie : String,
    description:String,
    img:String, 
    imgg :String, 
    stock : {
        type : Boolean,
        default : true
    },
    // stock : {
        // type : String,
        // default : 'in stock'
    // },
    solde : Boolean,
    remise: Number,
    count : Number,
    detail : String ,
    new_price : Number ,
    nbr_payment : {
        type : Number,
        default : 0
    },
    nbr_wish : {
        type : Number,
        default : 0
    }

});

const product = mongoose.model('Product',productSchema);

module.exports= product;