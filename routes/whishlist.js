const express = require("express");
const router = express.Router();
const Wishes = require("../models/Wishes");
const Product = require("../models/product");

const multer = require('multer');
const path = require("path");
const bodyParser = require('body-parser');
const { isWhiteSpaceSingleLine } = require("typescript");

//-------------------------------------Get All Whishlist------------------------------------
router.get('/whishlist', (req, res) => {
    console.log('Here into get all products in Whishlist');
    Wishes.find().then(
        (result) => {
            console.log(result);
            Wishes.count().then(
                (data) => {
                    console.log(data);
                    if (result) {
                        res.status(200).json({
                            whishlist: result,
                            nbr: data
                        })
                    }
                }
            )
        }
    )
});

//-------------------------get Wishes of user -----------------------------
router.get('/whishlist/:id', (req, res) => {
    console.log('Here into get wishlist of user by ID', req.params.id);
    Wishes.find({user : req.params.id }).then(
        (data) => {
            Wishes.count({user : req.params.id}).then(
                (number) => {
                    res.status(200).json({
                        number : number ,
                        wishes : data
                    })
                }
            )
        }
    )
});

//------------------------Delete Product in Whislist By Id -------------
router.post('/delete' , (req,res)=>{
    console.log('here in delete product from wishlist ',req.body);
  
      
    Wishes.deleteOne({name : req.body.name , user : req.body.user}).then(
        (data)=>{
            if (data){
                res.status(200).json({
                    message : 'deleted !'
                })
            }
            else {
                res.status(200).json({
                    message : 'error'
                })
            }
        }
    )
       
   
})



//-----------------------------------Delete Product From Whishlist -----------------------------

router.delete('/delete/product/:id', (req, res) => {
    console.log('Here into delete products by ID', req.params.id);
    Wishes.find({name : req.params.id}).then(
        (data)=>{
            console.log('daataaaaaa',data);
            for (let i = 0; i < data.length; i++) {
                  Wishes.deleteOne({ name:data[i].name }).then(
                        (result) => {
                            if (result) {
                                console.log('supprimer')
                     
                     
                     
                     }
                     }
                    )
                
            }
                    res.status(200).json({
                     message: 'Deleted Product with success '
                     })
        }
    )
    // Wishes.deleteOne({ _id: req.params.id }).then(
        // (result) => {
            // if (result) {
                // res.status(200).json({
                    // message: 'Deleted Product with success '
                // })
            // }
        // }
    // )
});



//---------------------- Add Product in Wishlist ----------------------------------------
router.post('/product/add', (req, res) => {
    console.log('Here in add product in whishlist :', req.body);
    const wish = new Wishes({
        name: req.body.name,
        price: req.body.price,
        categorie: req.body.categorie,
        price: req.body.price,
        img: req.body.img,
        stock: req.body.stock,
        user: req.body.user , 
        solde : req.body.solde
    })
    Wishes.findOne({ name: req.body.name, user: req.body.user }).then(
        (data) => {
            if (!data) {

                Product.findOne({name : req.body.name}).then(
                    (pro)=>{
                        pro.nbr_wish = pro.nbr_wish + 1;
                        Product.updateOne({name : req.body.name}, pro).then(
                            (ress)=>{
                                console.log('saayee');
                            }
                        )
                    }
                )


                wish.save().then(
                    (result) => {
                        if (result) {
                            res.status(200).json({
                                message: "product added in Whishlist  with succes "
                            })
                        }
                    }
                )
            }
            else {
                res.status(200).json({
                    message: "Product in wishlist !"
                })
            }
        }
    )
});

//------------------ get wishlist without deblicate -------------------
router.get('/deblicate' , (req,res)=>{
    // console.log('here in get ma8ir deb');
    Wishes.find().distinct('name').then(
        (data)=>{
                res.status(200).json({
                 wish : data
            })
        }        
    )
})
//------------------- Get Wishlist Information ------------------
router.get('/information/:wish' , (req,res)=>{
    // console.log('here in get information of wishlist');
    Wishes.findOne({name : req.params.wish}).then(
        (data)=>{
            res.status(200).json({
                wish : data
            })
        }
    )
})

//-------------------- get number wishlist in product ------------
router.get('/number/:id' , (req,res)=>{
    console.log('here in get number :',req.params.id);
    Wishes.count({name : req.params.id}).then(
        (data)=>{
            res.status(200).json({
                number : data
            })
        }
    )
})


//------------------ sorted Product in Wishlist ------------------
router.put('/sorted/:id' , (req,res)=>{
    console.log('here in sorted products',req.body);

    req.body.sort((x, y) =>  y.nbr - x.nbr);
    console.log('sortedd' , req.body);
})


module.exports = router;