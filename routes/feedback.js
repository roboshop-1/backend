const express = require("express");
const router = express.Router();
const Feed = require("../models/feedback");
const path  =require("path");
const User = require('../models/user');
const bodyParser = require('body-parser');
const Token = require('../models/tokenSchema');
const nodemailer = require('nodemailer');
const fs = require('fs');
const ejs = require('ejs');
const randomString = require('randomstring');
var smtpTransport = require('nodemailer-smtp-transport');
//------------------------------------------Add FeedBAck-------------------------------------------

router.post("/feed/add",(req,res) => {
    console.log('Here in add feedback ',req.body);
    const feed = new Feed({
        name: req.body.name,
        email: req.body.email,
        phone: req.body.phone,
        subject: req.body.subject,
        message: req.body.message
    });
    feed.save().then(
        (result) => {
            if(result){
                res.status(200).json({
                    message: "Feedback added with succes !"
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

//--------------------------- Get All Feedbacks --------------------------------------------
router.get('/feedbacks', (req,res) => {
    console.log('Here into get all feedbacks');
    Feed.find().then(
        (result) => {
            if (result) {
                Feed.count().then(
                    (data) =>{
                        // console.log(result);
                        res.status(200).json({
                            feedback: result , 
                            nbr : data
                        })
                    }
                )
               
            }
        }
    )
});

//------------------------------ Delete Feedback --------------------------
router.delete('/delete/:id', (req, res) => {
    console.log('Delete Feedback By ID', req.params.id);
    Feed.deleteOne({ _id: req.params.id }).then(
        (result) => {
            if (result) {
                res.status(200).json({
                    message: 'Deleted Feedback with success'
                })
            }
        }
    )
});

//----------------------------- Add Feedback to Home Page -----------------------
router.put("/home/add/:id", (req, res) => {
    console.log('Here in edit feedback', req.body);
    const feedback = new Feed({
        _id: req.params.id,
        name: req.body.name,
        email: req.body.email,
        phone: req.body.phone,
        subject: req.body.subject,
        message : req.body.message,
        visibility : req.body.visibility
    });
    console.log('new Feedback', feedback);
            Feed.updateOne({ _id: req.params.id }, feedback).then((result) => {
                console.log("updated ");
                res.status(200).json({
                    message: 'Update with success',
                    id: req.params.id
                });
            })
                .catch(err => {
                    console.log("error", err);
                    res.status(500).json({
                        error: err
                    });
                });
            })


//----------------------------- Delete Feedback from Home Page -----------------------
router.put("/home/delete/:id", (req, res) => {
    console.log('Here in edit feedback', req.body);
    const feedback = new Feed({
        _id: req.params.id,
        name: req.body.name,
        email: req.body.email,
        phone: req.body.phone,
        subject: req.body.subject,
        message : req.body.message,
        visibility : req.body.visibility
    });
    // console.log('new Feedback', feedback);
            Feed.updateOne({ _id: req.params.id }, feedback).then((result) => {
                console.log("updated ");
                res.status(200).json({
                    message: 'Update with success',
                    id: req.params.id
                });
            })
                .catch(err => {
                    console.log("error", err);
                    res.status(500).json({
                        error: err
                    });
                });
            })


//------------------------- Get Visibile Feedbacks in Home Page ----------------
router.get('/visible' , (req,res)=>{
    console.log('get all visible feedbacks' );
    Feed.find({visibility : true}).then(
        (data)=>{
            console.log('hahahahah',data)
            res.status(200).json({
                feedback : data
            })
        }
    )
})

//--------------------------- Messages -------------------------

router.post('/Messages/:id', async (req, res) => {
    // const company = await User.findOne({ email: req.body.email });
    // 
    // if (!company) {
        // res.status(400).json({ message: "Company does not exist" });
    // }
    // else {

        // const token = await Token.findOne({ companyId: company._id });
        // if (token) {
            // await token.deleteOne()
        // };

        // const resetToken = randomString.generate(30)
        // const createdToken = await new Token({
            // companyId: company._id,
            // token: resetToken,
        // }).save();
        //send mail
        NODE_TLS_REJECT_UNAUTHORIZED = 0;
       // console.log('resetToken', resetToken);
        const transporter = nodemailer.createTransport(smtpTransport ({
            service: 'gmail',
            port: 3001,
            auth: {
                 user:   "roboshop71@gmail.com",
                 pass:   "egsvgyxpxihericg"
                // user: process.env.EMAIL,
                // pass: process.env.PASSWORD,
            },
            tls: {
                // do not fail on invalid certs
                rejectUnauthorized: false
            },
            host: 'host'
        }));
        const templatePath = path.resolve('./backend/views', 'message.html');
        const registerTemplate = fs.readFileSync(templatePath, { encoding: 'utf-8' })
        let url = 'http://localhost:4200'
        const render = ejs.render(registerTemplate, { name: req.body.fname, message: req.body.message, link : `${url}` })
       // console.log('render',render);
        
            const info = await transporter.sendMail({
                from: '"ROBOSHOP', // sender address
                to: `${req.body.email}`,
                subject: req.body.subject, 
                html: render
            });
        
            const feed = new Feed({
                _id: req.params.id,
                name: req.body.name,
                email: req.body.email,
                phone: req.body.phone,
                subject: req.body.subject,
                // message : req.body.message,
                visibility : req.body.visibility,
                done : true
            });
            
                    Feed.updateOne({_id : req.params.id} , feed).then(
                        (data)=>{
                            console.log('updated ! ');
                            res.status(200).json({
                                msg : "updated !",
                                message: 'Check your mailbox' ,
                               });
                            })
                        
                    
            
          

          
          

       

    // }
})

//-------------------------Get Feedback By ID------------------------------------------
router.get('/get/:id', (req, res) => {
    console.log('Here into get feedback by ID', req.params.id);
    Feed.findOne({ _id: req.params.id }).then(
        (result) => {
            if (result) {
                res.status(200).json({
                    feedback: result
                })
            }
        }
    )
});


module.exports = router;
