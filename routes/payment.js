const express = require("express");
const router = express.Router();
const Visa = require("../models/visa");
const path  =require("path");
const bodyParser = require('body-parser');
 //---------------------------------------------


 //--------------------- check if card exist --------------------------
 router.post('/payment', (req, res) => {
    console.log('Here in payment part',req.body);
    Visa.findOne({ card : req.body.num_cart, cvv : req.body.cvv}).then(
        (result) => {
            if (result) {
                res.status(200).json({
                    check: 'true'
                })
            }
            else {
                res.status(200).json({
                    check: 'false'
                })
            }
        }
    )
});

module.exports = router;