const express = require("express");
const router = express.Router();
const User = require("../models/User");
const bcrypt = require('bcryptjs');
const { body, validationResult } = require("express-validator");
var jwt = require('jsonwebtoken');

const Jwt_Secret="krishna";
// create and use in /api/auth with POST doesnot require auth
router.post(
  "/createuser",
  body("name", "Enter a valid name").isLength({ min: 3 }),
  body("email", "Enter a valid email").isEmail(),
  body("password", "Enter a valid password").isLength({ min: 5 }),
  async(req, res) => {
    // if there are errors returns bad request
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    try {
       // check whether user exist already
    let user=await User.findOne({email:req.body.email})
    if(user){
      return res.status(400).json({error:"sorry user with this email already exist"})
    }
    const salt=await bcrypt.genSalt(10)
    const secpass=await bcrypt.hash(req.body.password,salt)
    user=await User.create({
      name: req.body.name,
      email: req.body.email,
      password: secpass,
    })
    const data={
      user:{
        id:user._id
      }
    }
    const authToken=jwt.sign(data,Jwt_Secret)
    // console.log(jwtData)

      // .then((user) => res.json(user))
      // .catch((err) =>
      //   res.json({
      //     err: "Please enter a unique value",
      //     message: err.message,
      //   })
      // );
      res.json(authToken)
    } catch (error) {
      res.status(500).send("some error occured")
    }
   
  }
);

//login code /api/auth/login
router.post(
  "/login",
  body("email", "Enter a valid email").isEmail(),
  body("password", "Please dont keep password empty").exists(),
  async(req, res) => { 
    // if there are errors returns bad request
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const {email,password}=req.body

    try {
      let user=await User.findOne({email})
      if(!user){
        return res.status(400).json({error:"please login with correct credentials"})
      }
      const passwordCompare=await bcrypt.compare(password,user.password)
      if(!passwordCompare){
        return res.status(400).json({error:"please login with correct credentials"})
      }
      const data={
        user:{
          id:user._id
        }
      }
      const authToken=jwt.sign(data,Jwt_Secret)
      res.json(authToken)
    } catch (error) {
      console.log(error)
      res.status(500).json("server error")
    }
  })
module.exports = router;
