const express = require("express");
const router = express.Router();
const Panier = require("../models/panier");
const Product = require("../models/product");

const multer = require('multer');
const path = require("path");
const bodyParser = require('body-parser');


//-------------------------------------Get All Panier------------------------------------
router.get('/panier/:id', (req, res) => {
    console.log('Here into get all products in Panier', req.params.id);
    Panier.find({ user: req.params.id }).then(
        (result) => {
            if (result) {
                res.status(200).json({
                    panier: result
                })
            }
            else {
                console.log('error');
            }
        }
    )
});
//---------------------Add product in cart ---------------------
router.post('/cart/add', (req, res) => {
    console.log('Here into Post cart ', req.body);
    // if (req.body.solde == true){
        // const pricee = req.body.new_price ;
        // console.log('priiicee',pricee);
    // }
    const panier = new Panier({
        name: req.body.name,
        price: req.body.price,
        quantity: req.body.quantity,
        img: req.body.img,
        imgg: req.body.imgg,
        total: req.body.price,
        stock: req.body.stock,
        user: req.body.user,
        remise : req.body.remise
    });
    Product.findOne({ name: req.body.name, user: req.body.user }).then(
        (data)=>{
            if (data){
                Panier.findOne({ user: req.body.user, name: req.body.name }).then(
                    (result)=>{
                        if (result){
                            result.quantity = result.quantity + req.body.quant ;
                            if (data.quantity < result.quantity) {
                                data.stock = "out of Stock";
                                result.quantity = data.quantity;
                            }
                            else {
                                data.stock = "In stock";
                                result.total = result.quantity * result.price;
                            }
                            // console.log('rreessuulltt;',result);
                            Panier.updateOne({ user: req.body.user, name: req.body.name }, result).then(
                                (ress) => {
                                    // console.log("Product in cart updated successfully!");
                                    res.status(200).json({
                                        message: "Product in cart updated successfully!"
                                    })
                                }
                            )
                        }
                        else {
                            panier.quantity = req.body.quant;
                            panier.total = panier.price * data.quantity;
                            panier.save().then(
                                (data) => {
                                    // console.log(data);
                                    res.status(200).json({
                                        panier: data
                                    })
                                })
                        }
                     
                    }
                )
            }
        }
    )


});


//-----------new version of add product in panier ------------------
router.post('/product/add', (req, res) => {
    console.log('Here into Post Panier ');
    // if(req.body.solde == true){
        // req.body.price = req.body.new_price;
    // }
    const panier = new Panier({
        name: req.body.name,
        price: req.body.price,
        new_price : req.body.new_price ,
        quantity: req.body.quantity,
        img: req.body.img,
        imgg: req.body.imgg,
        solde : req.body.solde ,
        total: req.body.price,
        stock: req.body.stock,
        user: req.body.user,
    });
    Product.findOne({ name: req.body.name }).then(
        (result) => {
            if (result) {
                console.log('hi ', result);
                Panier.findOne({ user: req.body.user, name: req.body.name }).then(
                    (data) => {
                        if (data) {
                            if (result.quantity <= data.quantity) {
                                result.stock = "out of Stock";
                                data.quantity = result.quantity;
                            }
                            else {
                                result.stock = "In stock";
                                data.quantity = data.quantity + 1;
                                if ( data.solde == true){
                                    data.total = data.quantity * data.new_price ;
                                }
                                else {
                                data.total = data.quantity * data.price;
                            }
                            }
                            Panier.updateOne({ user: req.body.user, name: req.body.name }, data).then(
                                (ress) => {
                                    console.log("Product in cart updated successfully!");
                                    res.status(200).json({
                                        message: "Product in cart updated successfully!"
                                    })
                                }
                            )
                        }
                        else {
                            panier.quantity = 1;
                            if ( panier.solde == true){
                                panier.total = panier.new_price;
                            }
                            else{
                            panier.total = panier.price;
                        }
                            panier.save().then(
                                (data) => {
                                    console.log('daataa :', data);
                                    res.status(200).json({
                                        panier: data
                                    })
                                })
                        }
                    }
                )
            }
        }
    )
});

//-----------------------------------Delete Product From Basket-----------------------------
router.post('/bascket/delete/product', (req, res) => {
    console.log('here in delete product from Panier', req.body);
    Panier.deleteOne({ name: req.body.name, user: req.body.user }).then(
        (data) => {
            Panier.count().then(
                (nbr) => {
                    res.status(200).json({
                        result: data,
                        number: nbr
                    })
                }
            )
        }
    )
})

//--------------------------Delete One  number of  Product From Basket---------------------
router.post('/bascket/delete', (req, res) => {
    console.log('Here In Basket : delete one product ', req.body);
    Product.findOne({ name: req.body.name })
        .then(
            (data) => {
                if (data) {
                    // console.log('here data testing', data);
                    req.body.quantity = req.body.quantity - 1;
                    // data.quantity = data.quantity + 1;
                    req.body.total = req.body.quantity * data.price;
                    if (req.body.quantity < 0) {
                        req.body.quantity = 0;
                        req.body.total = 0;

                    }
                    // console.log('after change', req.body);
                    Panier.updateOne({ name: data.name, user: req.body.user }, req.body)
                        .then((result) => {
                            console.log("product updated successfully!", req.body);
                            res.status(200).json({
                                message: "product updated successfully!",
                                result: req.body
                            })
                        })
                        .catch((error) => {
                            console.log(error);
                            res.status(200).json({
                                message: "error!",

                            })
                        });



                }
            }
        )
});

//---------------------------------------Get Prices-----------------------------
router.get('/panier/prices/:id', (req, res) => {
    console.log('Here in Get Prices', req.params.id);
    let p = 0;
    let n = 0;
    Panier.find().then(
        (result) => {
            Panier.count().then(
                (number) => {
                    //  console.log('result of number', number);
                    for (let i = 0; i < number; i++) {
                        if (result[i].user == req.params.id) {
                            p = result[i].total + p;
                            n = n + 1;
                        }
                        //  p = result[i].total + p
                    }
                    console.log('somme :', p);
                    console.log('result of number', n);
                    res.status(200).json({
                        prices: p,
                        nbr: n
                    })
                }
            )
        }
    )
});

//---------------------------------Get Product  ----------------------------------
router.post('/products', (req, res) => {
    console.log('Here in get product from panier  :', req.body);
    Panier.findOne({ name: req.body.name }).then(
        (data) => {
            if (data) {
                res.status(200).json({
                    pro: data
                })
            }
            else {
                res.status(200).json({
                    message: "error"
                })
            }
        }
    )
});




module.exports = router;