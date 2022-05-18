const mongoose = require('mongoose');

const blogSchema= mongoose.Schema({
    title:String,
    author:String,
    description1:String,
    img:String,
    quote:String,
    description2:String,
    imgg:String,
    date : Date,
    visits : {
        type: Number,
        default : 0
      }
});


const blog = mongoose.model('Blog',blogSchema);

module.exports= blog;