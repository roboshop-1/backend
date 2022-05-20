const express = require('express');
const router = express.Router();
const User = require('../models/user');
const Token = require('../models/tokenSchema');
const nodemailer = require('nodemailer');
const fs = require('fs');
const path = require('path');
const ejs = require('ejs');
const randomString = require('randomstring');
var smtpTransport = require('nodemailer-smtp-transport');


router.post('/forgot-password', async (req, res) => {
    const company = await User.findOne({ email: req.body.email });
    
    if (!company) {
        res.status(400).json({ message: "Company does not exist" });
    }
    else {

        const token = await Token.findOne({ companyId: company._id });
        if (token) {
            await token.deleteOne()
        };

        const resetToken = randomString.generate(30)
        const createdToken = await new Token({
            companyId: company._id,
            token: resetToken,
        }).save();
        //send mail
        NODE_TLS_REJECT_UNAUTHORIZED = 0;
       // console.log('resetToken', resetToken);
        const transporter = nodemailer.createTransport(smtpTransport ({
            service: 'gmail',
            port: 3001,
            auth: {
                user:   "roboshop71@gmail.com",
                pass:   "egsvgyxpxihericg"
            },
            tls: {
                // do not fail on invalid certs
                rejectUnauthorized: false
            },
            host: 'host'
        }));
        const templatePath = path.resolve('./backend/views', 'resetPassword.html');
        const registerTemplate = fs.readFileSync(templatePath, { encoding: 'utf-8' })
        let url = 'http://localhost:4200'
        const render = ejs.render(registerTemplate, { name: company.name, link: `${url}/reset-password/${createdToken.token}` })
        console.log('render',render);
        //  try{
        
            const info = await transporter.sendMail({
                from: '"ROBOSHOP', // sender address
                to: `${company.email}`,
                subject: "Password reset", 
                html: render
            });
                 
        // }
        // catch(err){
        // console.log('error',err);
        // }

        res.json({ message: 'Check your mailbox' ,token : resetToken});
    }
})


module.exports = router;
