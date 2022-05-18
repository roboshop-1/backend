const express = require("express");
const router = express.Router();
const Avispro = require("../models/avispro");
const path  =require("path");
const bodyParser = require('body-parser');

//------------------------------------------Add Review-------------------------------------------

router.post("/avis-produit/add",(req,res) => {
    console.log('Here in add Avis ',req.body);
    const feed = new Avispro({
        name: req.body.name,
        product: req.body.product,
        review: req.body.review,
        datails: req.body.details,
        star: req.body.star
    });
    // console.log('here avis ', feed);
    feed.save().then(
        (result) => {
            if(result){
                res.status(200).json({
                    message: "Review added with succes !"
                })  
            }
            else {
                res.status(200).json({
                    message: "Operation failed ! "
                })  
            }
        }

    )     
});

//-------------------------------------Get All reviews ------------------------------------
router.get('/review', (req, res) => {
    console.log('Here into get all reviews ');
    Avispro.find().then(
        (result) => {
            Avispro.count().then(
                (data)=>{
                    if (result) {
                        res.status(200).json({
                            review: result,
                            nbr : data
                        })
                    }
                }
            )
        }
    )
});

//-------------------------------------Get reviews of product ------------------------------------
router.get('/review/:id', (req, res) => {
    console.log('Here into get all reviews of product by ID:',req.params.id);
    Avispro.find({product : req.params.id}).then(
        (result) => {
            Avispro.count({product : req.params.id}).then(
                (data)=>{
                    if (result) {
                        let l = 0 ;
                        let s = 0 ;
                        for (let i = 0; i < data; i++) {
                            l = result[i].star + l ;   
                        }
                        let somme = l/data ;
                        if ((somme% 1)!= 0) {
                            s = parseInt(somme)
                        }
                        else{
                            s = somme;
                        }
                        res.status(200).json({
                            review: result,
                            nbr : data,
                            star : s
                        })
                    }
                }
            )
        }
    )
});

//---------------- Get number of reviews for one product -------------------
router.get('/number/:id', (req, res) => {
    console.log('Number of Reviews of product by ID :',req.params.id);
    Avispro.count({product : req.params.id}).then(
        (data)=>{
            res.status(200).json({
                number : data 
            })
        }
    )
});



module.exports = router;
