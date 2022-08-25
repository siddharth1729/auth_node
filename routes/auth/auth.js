/**************************************************
 *             author : siddharth                  *
 ****************************************************/
const express = require("express");
const router = require("express").Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../../models/User");
var bodyParser = require("body-parser");
const app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const Joi = require("@hapi/joi");

//TOKEN FOR JWT
TOKEN_SECRET =
  "hcjsdbshhsbdcjbsjjbsbbdibjnssxjudqwnanjnxjsjxcceuhfbdsqklhgyxrdrxsx";

//VALIDATION OF USER INPUTS PREREQUISITES
const registerSchema = Joi.object({
  fname: Joi.string().min(3).required(),
  lname: Joi.string().min(3).required(),
  email: Joi.string().min(6).required().email(),
  password: Joi.string().min(6).required(),
  token: Joi.string().min(2).required(),
});

//###################################################################
//#####################  SIGNUP USER    #############################
router.post("/register", async (req, res) => {
  const response = { success: false, result: {}, message: "" };

  //CHECKING IF USER EMAIL ALREADY EXISTS
  const emailExist = await User.findOne({ email: req.body.email });
  //IF EMAIL EXIST THEN RETURN
  if (emailExist) {
    res.status(400).send("Email already exists");
    return;
  }

  //GENERATING RANDOM TOKEN
  generate = (payload) => {
    const token = String(payload) + Math.random().toString(36).slice(2);
    return token;
  };

  const tokenvalue = generate(TOKEN_SECRET);
  console.log(tokenvalue);

  //HASHING THE PASSWORD
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(req.body.password, salt);

  //ON PROCESS OF ADDING NEW USER

  var user = new User({
    fname: req.body.fname,
    lname: req.body.lname,
    email: req.body.email,
    password: hashedPassword,
    token: tokenvalue,
  });

  try {
    //VALIDATION OF USER INPUTS

    const { error } = await registerSchema.validateAsync(req.body);
    //WE CAN JUST GET THE ERROR(IF EXISTS) WITH OBJECT DECONSTRUCTION

    //   IF ERROR EXISTS THEN SEND BACK THE ERROR
    if (error) {
      res.status(400).send(error.details[0].message);
      return;
    } else {
      //NEW USER IS ADDED

      const saveUser = await user.save();
    }
    if (user) {
      response.success = true;
      response.result = user;
    }
  } catch (error) {
    response.success = false;
    response.result = error.message;
  }
  res.json(response);
});

const loginSchema = Joi.object({
  email: Joi.string().min(6).required().email(),
  password: Joi.string().min(6).required(),
  token: Joi.string().min(2).required(),
});

//###################################################################
//#####################   LOGIN USER    #############################
router.post("/login", async (req, res) => {
  const response = { success: false, result: {}, message: "" };
  console.log(req.body);

  //CHECKING IF USER EMAIL EXISTS

  const user = await User.findOne({ email: req.body.email });
  console.log(user);
  if (!user) return res.status(400).send("Incorrect Email- ID");

  //CHECKING IF TOKEN MATCHS

  const bodytoken = req.body.token;
  console.log(bodytoken);
  if (bodytoken ==user.token ) {
    console.log("good to go");
  }else{
    response.success = false;
    response.message = "Token do not exist or do not match!";
    return res.status(400).send("Incorrect token- ID");
  }

  //CHECKING IF USER PASSWORD MATCHES

  const validPassword = await bcrypt.compare(req.body.password, user.password);
  if (!validPassword) return res.status(400).send("Incorrect Password");

  try {
    //VALIDATION OF USER INPUTS
    console.log("======lllllllll===========");
    const { error } = await loginSchema.validateAsync(req.body);
    console.log(error);
    if (error) return res.status(400).send(error.details[0].message);
    else {
      //SENDING BACK THE TOKEN
      const token = jwt.sign({ _id: user._id }, TOKEN_SECRET);
      //const v =res.header("auth-token", token).send(token);
      if (token) {
        response.success = true;
        response.result = token;
      }
      res.json(response);
    }
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
});

module.exports = router;
