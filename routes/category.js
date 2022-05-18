const express = require("express");
const router = express.Router();
const Category = require("../models/category");
const path = require("path");
const bodyParser = require('body-parser');
const Product = require("../models/product");


//----------------------------------- Add Category ---------------------------
router.post('/add', (req, res) => {
    console.log('Here in Add New Category ', req.body.name_categorie);
    let category = new Category({
        name: req.body.name_categorie
    })
    Category.findOne({ name: req.body.name_categorie }).then(
        (data) => {
            if (data) {
                // console.log('exist',data);
                res.status(200).json({
                    message: "This Category Exist !"
                })
            }
            else {
                category.save().then(
                    (result) => {
                        res.status(200).json({
                            message: "Category added successfully !"
                        })
                    }
                )
            }
        }
    )
});


//----------------------------------- Get All Categorys ---------------------------
router.get('/all', (req, res) => {
    console.log('Here in get All categorys');
    Category.find().then(
        (result) => {
            Category.count().then(
                (number) => {
                    res.status(200).json({
                        category: result ,
                        nbr : number
                    })
                }
            )
        }
    )
});

//-------------------------- Get One Category by Name ---------------------------
router.get('/get/:category', (req,res)=>{
    console.log('here in get category by name ',req.params.category);
    Category.findOne({name : req.params.category}).then(
        (result)=>{
            if (result){
                console.log('category ',result);
                res.status(200).json({
                    category : result
                })
            }
        }
    )
});

//------------------Get Number Of Product ----------------------
router.get('/number/:category', (req,res)=>{
    console.log('here in get number of products of this category :',req.params.category);
    Product.count({categorie : req.params.category}).then(
        (data)=>{
            console.log('number is :',data);
            res.status(200).json({
                number : data
            })
        }
    )
})


//------------------Get Number Of Product ----------------------
router.get('/payment/:category', (req,res)=>{
    console.log('here in get number of payment of this category :',req.params.category);
    Product.find({categorie : req.params.category}).then(
        (data)=>{
            var x = 0 ;
            for (let i = 0; i < data.length; i++) {
               x = x + data[i].nbr_payment;
            }
            res.status(200).json({
                number : x
            })
        }
    )
})

//------------- Get total prices of category ----------------------
router.get('/prices/:category' , (req,res)=>{
    console.log('Here get prices category',re.params.category);
    // Product.
})

//-------------------------------- Delete Category --------------------------------

module.exports = router;