const express = require("express");
const router = express.Router();
const Order = require("../models/orders");
const path  =require("path");
const bodyParser = require('body-parser');
const Product = require("../models/product");

//-------------------------------------- Add Order -------------------------------------
router.post("/add",(req,res) => {
    console.log('Here in add order',req.body);
    const order = new Order ({
        date : req.body.date,
        number : req.body.number,
        total_prices : req.body.total_prices,
        products : req.body.products,
        user : req.body.user
    });
    for (let i = 0; i < order.products.length; i++) {
        Product.findOne({name : order.products[i].name}).then(
            (data)=>{
                data.nbr_payment = data.nbr_payment + 1 ;
                Product.updateOne({name : data.name},data).then(
                    (result)=>{
                        console.log('Updated !')
                    }
                )

            }
        )
        
    }
    order.save().then(
        (result) => {
            if (result) {
                res.status(200).json({
                    message: "Order added with succes ",
                    product: result
                })
            }
        }
    )
});

//------------------------------------ Get All Order ----------------------------------------------
router.get("/all", (req, res) => {
    console.log('Here in get all Orders');
    Order.find().then(
        (result)=>{
            Order.count().then(
                (nbr)=>{

           
           
        res.status(200).json({
            orders: result,
            number : nbr
        });
    }
    )
    });
});

//------------------------------------- Get total prices ----------------------
router.get("/totals", (req, res) => {
    console.log('Here in Get total prices ');
    Order.find().then(
        (data)=>{
            if(data){
                var x = 0;
                for (let i = 0; i < data.length; i++) {
                    x = x + data[i].total_prices; 
            
                }
                res.status(200).json({
                    prices : x
                })
            }
        }
    )
})



//-------------------------------------- Get Order By ID -----------------------
router.get("/:id",(req,res)=>{
    console.log('here in get order  by id ',req.params.id);
    Order.findOne({_id : req.params.id}).then(
        (data)=>{
                    if (data){
                        res.status(200).json({
                            order : data,
                        })
                    } 
        }
    )
});

//-------------------------------------- Get User Order By ID -----------------------
router.get("/user/:id",(req,res)=>{
    console.log('here in get order  by id ',req.params.id);
    Order.find({user : req.params.id}).then(
        (data)=>{
                    if (data){
                        res.status(200).json({
                            order : data,
                        })
                    } 
        }
    )
});

//------------------------ Validate Order *--------------------------
router.delete('/validate/:id' , (req,res)=>{
    console.log('here in validate order ',req.params.id);
    Order.findOne({_id : req.params.id}).then(
        (data)=>{
            data.status = true
            Order.updateOne({_id : req.params.id }, data).then(
                (result)=>{
                    res.status(200).json({
                        message : "Updated !"
                    })
                }
            )
        }
    )
})

//---------------------------Show Validate Orders ----------------------------
router.get('/validated/all' , (req, res)=>{
    console.log('here in get all validated orders');
    Order.find({status : true}).then(
        (data)=>{
            res.status(200).json({
                orders : data
            })
        }
    )
})

//---------------------------Show no Validate Orders ----------------------------
router.get('/no_validate/all' , (req, res)=>{
    console.log('here in get all no validated orders');
    Order.find({status : false}).then(
        (data)=>{
            res.status(200).json({
                orders : data
            })
        }
    )
})

//--------------------- Delete Order ------------------------------
router.delete('/delete/:id', (req, res) => {
    console.log('Delete order By ID', req.params.id);
    Order.deleteOne({ _id: req.params.id }).then(
        (result) => {
            if (result) {
                res.status(200).json({
                    message: 'Deleted order with success'
                })
            }
        }
    )
});


module.exports = router;