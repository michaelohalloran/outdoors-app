const mongoose = require('mongoose');
const express = require('express');
const passport = require('passport');
const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();
const morgan = require('morgan');
const jwt = require('jsonwebtoken');
const config = require('../config');
const router = express.Router();

//import URLs for DB
const {TEST_URL, PORT} = require('../config.js');
mongoose.connect(TEST_URL);
mongoose.Promise = global.Promise;
console.log('testing inside router.js');
router.use(morgan('common'));
router.use(jsonParser);
router.use(bodyParser.urlencoded({ extended: true}));

const createAuthToken = function(user) {
  return jwt.sign({user}, config.JWT_SECRET, {
    subject: user.username,
    expiresIn: config.JWT_EXPIRY,
    algorithm: 'HS256'
  });
};

const localAuth = passport.authenticate('local', {session: false});

//**********************************************************************************
//CRUD ROUTES
//**********************************************************************************

//creates authToken, returns it back to client
//this involves authentication
//this is /api/auth/login route
router.post('/login', localAuth, (req,res)=> {
  //something in Passport authenticate attaches additional ability (like "user") onto request object (could not have called this "blah")
    console.log('testing login route');
    const authToken = createAuthToken(req.user.serialize());
    res.json({authToken});
});

const jwtAuth = passport.authenticate('jwt', {session: false});

//refresh expired JWT token w/ updated one
//this is /api/auth/refresh route
router.post('/refresh', jwtAuth, (req, res) => {
    const authToken = createAuthToken(req.user);
    res.json({authToken});
  });
  

//restrict access only to logged in users

module.exports = {router};