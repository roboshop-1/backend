const express = require("express");
const router = express.Router();
const User = require("../models/user");
const path  =require("path");
const bodyParser = require('body-parser');

//---------------------------- Add employee role ---------------
router.put('/add/employee/:id' , (req,res)=>{
    console.log('here in add employee');
    const user = new User({
        _id: req.params.id,
        fname: req.body.fname,
        lname: req.body.lname,
        email: req.body.email,
        pwd: req.body.pwd,
        postcode: req.body.postcode,
        country: req.body.country,
        phone: req.body.phone,
        city: req.body.city,
        role : 'Employee'
    });
    
            console.log('this is user : ',user);
            User.updateOne({_id : req.params.id} , user).then(
                (data)=>{
                    console.log('updated ! ');
                    res.status(200).json({
                        message : "updated !"
                    })
                }
            )
    
    
});

//---------------------------- Add redactor role ---------------
router.put('/add/redactor/:id' , (req,res)=>{
    console.log('here in add redactor');
    const user = new User({
        _id: req.params.id,
        fname: req.body.fname,
        lname: req.body.lname,
        email: req.body.email,
        pwd: req.body.pwd,
        postcode: req.body.postcode,
        country: req.body.country,
        phone: req.body.phone,
        city: req.body.city,
        role : 'Redactor'
    });
    
            console.log('this is user : ',user);
            User.updateOne({_id : req.params.id} , user).then(
                (data)=>{
                    console.log('updated ! ');
                    res.status(200).json({
                        message : "updated !"
                    })
                }
            )
    
    
});

//------------------------ Get All Employees -------------------------
router.get('/employees' ,(req,res)=>{
    console.log('here in get all employees');
    User.find({role : 'Employee'}).then(
        (data)=>{
            res.status(200).json({
                employes : data
            })
        }
    )
})

//------------------------ Get All Redactors -------------------------
router.get('/Redactors' ,(req,res)=>{
    console.log('here in get all Redactors');
    User.find({role : 'Redactor'}).then(
        (data)=>{
            res.status(200).json({
                redactors : data
            })
        }
    )
})

//------------------------ Delete Employee ----------------------------
router.put('/delete/employee/:id' , (req,res)=>{
    console.log('here in delete employee');
    const user = new User({
        _id: req.params.id,
        fname: req.body.fname,
        lname: req.body.lname,
        email: req.body.email,
        pwd: req.body.pwd,
        postcode: req.body.postcode,
        country: req.body.country,
        phone: req.body.phone,
        city: req.body.city,
        role : 'Client'
    });
    
            console.log('this is user : ',user);
            User.updateOne({_id : req.params.id} , user).then(
                (data)=>{
                    console.log('updated ! ');
                    res.status(200).json({
                        message : "updated !"
                    })
                }
            )
    
    
});



module.exports = router;
