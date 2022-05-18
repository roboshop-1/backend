const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const Token = require('../models/tokenSchema')
const Company = require('../models/user');

router.post('/reset-password', async (req, res) => {
    console.log('reset :',req.body.token);
  let passwordResetToken = await Token.findOne({ token: req.body.token });
  if (!passwordResetToken) {
    res.status(400).json({ message: "Invalid or expired password reset link" });
  } else {
    const currentDate = new Date();
    const expireTime= new Date(passwordResetToken.createdAt)
    const diff =currentDate - expireTime
    const seconds = Math.floor( diff/1000);
    if (seconds < 900){
      const bcryptSalt = process.env.BCRYPT_SALT;
      console.log('bycrypt',bcryptSalt);
      const hash = await bcrypt.hash(req.body.password, Number(bcryptSalt));
      await Company.updateOne(
        { _id: passwordResetToken.companyId },
        { $set: { password: hash } },
        { new: true }
      );
      const company = await Company.findById(passwordResetToken.companyId);
      await passwordResetToken.deleteOne();
      res.status(200).json({message : 'Successfully reseted'})
    } else {
      await passwordResetToken.deleteOne();
      res.status(401).json({message : 'Invalid or expired password reset link'})
    }
  }
})

module.exports = router;