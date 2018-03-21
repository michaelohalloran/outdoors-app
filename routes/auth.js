const mongoose = require('mongoose');
const express = require('express');
const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();
const morgan = require('morgan');
const mongoose = require('mongoose');

const router = express.Router();

//import URLs for DB
const {TEST_URL, PORT} = require('../config.js');
mongoose.connect(TEST_URL);
mongoose.Promise = global.Promise;

router.use(morgan('common'));
router.use(jsonParser);
router.use(bodyParser.urlencoded({ extended: true}));

const createAuthToken;
const localAuth;
const jwtAuth;

//**********************************************************************************
//CRUD ROUTES
//**********************************************************************************

// router.


module.exports = authenticateUser;
module.exports = router;