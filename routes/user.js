const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const User = require("../models/user");
const Order = require("../models/orders");
const jwt = require('jsonwebtoken');

//------------------------------------------Signup-------------------------------------------
router.post('/users/add', (req, res) => {
    console.log('Here in Signup');
    bcrypt.hash(req.body.pwd, 10).then(
        (cryptedPwd) => {
            console.log('Here into Post user ', req.body);
            const user = new User({
                fname: req.body.fname,
                lname: req.body.lname,
                email: req.body.email,
                pwd: cryptedPwd,
                postcode: req.body.postcode,
                country: req.body.country,
                phone: req.body.phone,
                city: req.body.city
            });
            console.log('here user ', user);
            User.count().then(
                (number)=>{
                    console.log('number of users : ',number);
                    if (number == 0){
                        user.role = "Admin";
                    }
                }
            )
            User.findOne({ email: req.body.email })
                .then(
                    (result) => {
                        if (result) {
                            res.status(200).json({
                                message: "0"
                            })
                        }
                        else {
                            user.save().then(
                                (resultt) => {
                                    res.status(200).json({
                                        message: "User added with succes ",
                                        id : user.id,
                                        user : user
                                    })
                                })
                        }
                    }
                )
        })
});
//-----------------------------------Login----------------------------------------------
router.post("/users/login", (req, res) => {
    console.log('Here in Login ', req.body);
    User.findOne({ email: req.body.email })
        .then(
            (result) => {
                // console.log('Result after find by email', result);
                if (!result) {
                    res.status(200).json({
                        message: '0'
                    });
                }
                else {
                    bcrypt.compare(req.body.pwd, result.pwd, (err, resp) => {
                        if (!resp) {
                            // console.log(resp);
                            res.status(200).json({
                                message: '1'
                            });
                        }
                        else {
                           
                            User.findOne({ email: req.body.email }).then(
                                (data) => {
                                    res.status(200).json({
                                        name: data.id,
                                        message: '2',
                                        user : data
                                    });
                                }
                            )
                        }
                    }
                    )
                }
            }
        )
});
//-----------------------------------Delete User----------------------------------------------------
router.delete("/users/:id", (req, res) => {
    console.log('Here in delete user by ID ');
    User.deleteOne({ _id: req.params.id }).then(result => {
        console.log(result);
        res.status(200).json
            ({ message: 'user deleted !' });
    });
});

//----------------------------------------Get All Users -------------------------------------------

router.get("/users", (req, res) => {
    console.log('Here in get all Users');
    User.find().then(documents => {
        User.count().then(
            (number)=>{
        res.status(200).json({
            users: documents,
            nbr : number
        });
    }
    )
    });
});

//----------------------------------------Get All Users -------------------------------------------

router.get("/clients", (req, res) => {
    console.log('Here in get all Clients');
    User.find({role : 'Client'}).then(documents => {
        User.count().then(
            (number)=>{
        res.status(200).json({
            users: documents,
            nbr : number
        });
    }
    )
    });
});


//-----------------------------------Get User By Email -----------------------------
router.get("/email/:email", (req, res) => {
    console.log('Here in get user by ID', req.params.email);
    User.findOne({ email: req.params.email })
        .then(
            (user) => {

                if (user) {
                    res.status(200).json({
                        user: user,
                        message :'finding user by email'
                    });
                }
                else {
                    res.status(200).json({
                        
                        message :'user not finding'
                    });
                }



            });
});
//-----------------------------------Get User By ID-----------------------------------------------------

router.get("/users/:id", (req, res) => {
    console.log('Here in get user by ID', req.params.id);
    User.findOne({ _id: req.params.id })
        .then(
            (user) => {

                if (user) {
                    res.status(200).json({
                        user: user
                    });
                }



            });
});
//-------------------------------- Decrypt pwd ------------------------------------------
router.post('/decrypt/pwd', (req, res) => {
    console.log('Here in Decrypt password', req.body.pwd);
    User.findOne({ email: req.body.email }).then(
        (data) => {
            if (data) {
                console.log('data.pwd', data.pwd);
                bcrypt.compare(req.body.pwd, data.pwd, (err, resp) => {
                    console.log('resp', resp);
                    if (!resp) {
                        console.log('resp :', resp);
                        res.status(200).json({
                            message: "0"
                        });
                    }
                    else {
                        res.status(200).json({
                            message: "1"
                        });
                    }
                }
                )
            }
        }
    )
});

//---------------------------------Edit User By ID------------------------------------
router.put("/edit/:id", (req, res) => {
    console.log('Here in edit user', req.body);
    bcrypt.hash(req.body.pwd, 10)
        .then((cryptedPwd) => {
            const user = new User({
                _id: req.params.id,
                fname: req.body.fname,
                lname: req.body.lname,
                email: req.body.email,
                pwd: cryptedPwd,
                postcode: req.body.postcode,
                country: req.body.country,
                phone: req.body.phone,
                city: req.body.city,
                role : req.body.role
            });
            console.log('new user', user);
            console.log('req.params.id', req.params.id);
           
           
                    User.updateOne({ _id: req.params.id }, user).then((result) => {
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
        });

 //----------------- Number Orders of User by id  -------------
 router.get('/orders/:id' , (req,res)=>{
    console.log('here in get Number of orders ');
    Order.count({user : req.params.id}).then(
        (nbr)=>{
            res.status(200).json({
                number : nbr
            })
        }
    )
 })


    module.exports = router;