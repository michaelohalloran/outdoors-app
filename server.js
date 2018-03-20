const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();
const morgan = require('morgan');
const mongoose = require('mongoose');

//import URLs for DB
const {TEST_URL, PORT} = require('./config.js');
mongoose.connect(TEST_URL);
mongoose.Promise = global.Promise;

app.use(morgan('common'));
app.use(jsonParser);
app.use(bodyParser.urlencoded({ extended: true}));

//import Mongoose schema
const {User} = require('./models/users');
const {Post} = require('./models/posts');

//import users Route 
const {router: postsRouter} = require('./routes/users');
app.use('/posts', postsRouter);

//import middleware
const auth = require('./routes/auth');

// let newPost = new Post({title: "Test Post 1", content: "Content here", image: "https://coloradosprings.gov/sites/default/files/styles/page_image/public/pikes_peak_highway.jpg?itok=Kqzh59pj"});



//Possibly add runServer, closeServer, and require.main components here

//this makes public holder files accessible to this app
// app.use(express.static('public'));

app.listen(process.env.PORT || 8080, function(){
    console.log("Server started");
});

module.exports = {app};