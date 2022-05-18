const mongoose = require('mongoose');

const wishesSchema= mongoose.Schema({
    name:String,
    description :String,
    price :Number ,
    img:String,
    categorie : String,
    stock : {
        type : Boolean,
        default : true
    },
    user : String ,
    solde : Boolean
 
});

const wishes = mongoose.model('Wishes',wishesSchema);

module.exports= wishes;


