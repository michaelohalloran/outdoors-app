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

const {Post} = require('../models/posts');

//**********************************************************************************
//CRUD ROUTES
//**********************************************************************************

//GET all posts from /posts URL
router.get('/', (req, res)=> {
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

//GET individual post
router.get('/:id', (req, res)=> {
    Post
       .findById(req.params.id)
       .then(post=>res.json(post.serialize()))
       .catch(err=>{
           console.error(err);
           res.status(500).json({error: "Internal server error"});
       });
});

//POST new posts, this goes to /posts URL
router.post('/', (req, res)=> {
    //check is user is logged in, if so, allow them to post new post to DB

    //check required fields
    const requiredFields = ['title', 'content'];
    for(let i = 0; i < requiredFields.length; i++) {
        const field = requiredFields[i];
        if(!(field in req.body)) {
            const message = `Missing field ${field} in request body`;
            console.error(message);
            return res.status(400).send(message);
        }
    };

    Post
        .create({
            title: req.body.title,
            content: req.body.content,
            image: req.body.image
        })
        .then(post=> res.status(201).json(post.serialize()))
        .catch(err=> {
            console.error(err);
            res.status(500).message("Internal server error");
        });
});

//UPDATE POSTS
router.put('/:id', (req, res)=> {
    //check is user is logged in; if so, allow them to update a post by ID from DB

    //check that req.body.id and req.params.id are ===?

    const toUpdate = {};
    const updateableFields = ['title', 'content', 'image'];
    updateableFields.forEach((field)=>{
        if(field in req.body) {
            toUpdate[field] = req.body[field];
        };
    })

    Post
        .findByIdAndUpdate(req.params.id, {$set: toUpdate})
        .then(res.status(204).end())
        .catch(err=>res.status(500).json({message: "Internal server error"}));
});

//DELETE POSTS
router.delete('/:id', (req, res)=> {
    //check is user is logged in; if so, allow them to delete a post
    Post
        .findByIdAndRemove(req.params.id)
        .then(post=>res.status(204).end())
        .catch(err=>res.status(500).json({message: "Internal server error"}));
});

module.exports = {router};