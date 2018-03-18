const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();
const morgan = require('morgan');
const mongoose = require('mongoose');


// mongoose.connect('mongodb://localhost/outdoors_app');
mongoose.Promise = global.Promise;

//this makes public holder files accessible to this app

app.use(morgan('common'));
app.use(jsonParser);
app.use(bodyParser.urlencoded({ extended: true}));

//import Mongoose schema
const {User} = require('./models/users');
const {Post} = require('./models/posts');

//import middleware
const auth = require('./auth');

//*********************************************************************************************
//ROUTES
//*********************************************************************************************

// app.get('/', (req, res)=> {
//     //retrieve all posts from DB and render them

// });

// app.post('/', (req, res)=> {
//     //check is user is logged in, if so, allow them to post new post to DB

// });

// app.put('/', (req, res)=> {
//     //check is user is logged in; if so, allow them to update a post by ID from DB

// });

// app.delete('/', (req, res)=> {
//     //check is user is logged in; if so, allow them to delete a post

// });



app.use(express.static('public'));

app.listen(process.env.PORT || 8080, function(){
    console.log("Server started");
});

module.exports = {app};