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

//import middleware
const auth = require('./auth');

//*********************************************************************************************
//ROUTES
//*********************************************************************************************

// let newPost = new Post({title: "Test Post 1", content: "Content here", image: "https://coloradosprings.gov/sites/default/files/styles/page_image/public/pikes_peak_highway.jpg?itok=Kqzh59pj"});

app.get('/posts', (req, res)=> {
    //retrieve all posts from DB and render them
    Post
        .find()
        .then(posts=> {
            res.json(posts.map((post)=>post.serialize()));
        })
        .catch(err=>{
            console.error(err);
            res.status(500).json({error: "Internal server error"});
        });
});


// app.get('/posts/:id', (req, res)=> {
//  Post
//        .findOne()
// })


// app.post('/posts', (req, res)=> {
//     //check is user is logged in, if so, allow them to post new post to DB

//     //check required fields
//     const requiredFields = ['title', 'content'];
//     for(let i = 0; i < requiredFields.length; i++) {
//         const field = requiredFields[i];
//         if(!(field in req.body)) {
//             const message = `Missing field ${field} in request body`;
//             console.error(message);
//             return res.status(400).send(message);
//         }
//     };

//     Post
//         .create({
//             title: req.body.title,
//             content: req.body.content,
//             image: req.body.image
//         })
//         .then(post=> res.status(201).json(post.serialize()))
//         .catch(err=> {
//             console.error(err);
//             res.status(500).message("Internal server error");
//         });
// });

// app.put('/', (req, res)=> {
//     //check is user is logged in; if so, allow them to update a post by ID from DB

// });

app.delete('/:id', (req, res)=> {
    //check is user is logged in; if so, allow them to delete a post

});


//this makes public holder files accessible to this app
// app.use(express.static('public'));

app.listen(process.env.PORT || 8080, function(){
    console.log("Server started");
});

module.exports = {app};