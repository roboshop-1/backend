const express = require("express");
const router = express.Router();
const Visa = require("../models/visa");
const path  =require("path");
const bodyParser = require('body-parser');
 //---------------------------------------------


 //--------------------- check if card exist --------------------------
 router.get('/payment', (req, res) => {
    console.log('Here in payment part');
    Visa.findOne({ card: req.params.card }).then(
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