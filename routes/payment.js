const express = require("express");
const router = express.Router();
const Visa = require("../models/visa_card");
const path  =require("path");
const bodyParser = require('body-parser');
 //---------------------------------------------


 //--------------------- check if card exist --------------------------
 router.post('/payment', (req, res) => {
    console.log('Here in payment part',req.body);
    const order = new Visa ({
        card : req.body.num_cart,
        cvv : req.body.cvv,
    });
    Visa.save().then(
        (result) => {
            if (result) {
                res.status(200).json({
                    message: "Order added with succes ",
                    product: result
                })
            }
        }
    )
    // Visa.({ card : req.body.num_cart, cvv : req.body.cvv}).then(
        // (result) => {
            // if (result) {
                // console.log('result in ok ');
                // res.status(200).json({
                    // check: 'true'
                // })
            // }
            // else {
                // console.log('result in noo ');
                // res.status(200).json({
                    // check: 'false'
                // })
            // }
        // }
    // )
});

module.exports = router;