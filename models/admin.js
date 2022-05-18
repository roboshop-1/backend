const mongoose = require('mongoose');

const adminSchema= mongoose.Schema({
    fname:String,
    lname:String,
    email:String,
    pwd:String,
});


const admin = mongoose.model('Admin',adminSchema);

module.exports= admin;