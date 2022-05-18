const mongoose = require('mongoose');

const categorySchema= mongoose.Schema({
    name:String
});

const category = mongoose.model('Category',categorySchema);

module.exports= category;