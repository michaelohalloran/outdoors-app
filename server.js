require('dotenv').config();
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();
const morgan = require('morgan');
const mongoose = require('mongoose');
const passport = require('passport');

app.use(morgan('common'));
app.use(jsonParser);
app.use(bodyParser.urlencoded({ extended: true}));

//import Mongoose schema
const {User} = require('./models/users');
const {Post} = require('./models/posts');
const { localStrategy, jwtStrategy } = require('./routes/strategies');

//import routes
const {router: postsRouter} = require('./routes/posts');
const {router: authRouter} = require('./routes/auth');

// mongoose.connect(TEST_URL);
mongoose.Promise = global.Promise;
//import URLs for DB
const {TEST_URL, PORT} = require('./config.js');

app.use('/posts', postsRouter);
app.use('/users', authRouter);

passport.use(localStrategy);
passport.use(jwtStrategy);
const jwtAuth = passport.authenticate('jwt', {session: false});

// //import middleware
// const auth = require('./routes/auth');

// let newPost = new Post({title: "Test Post 1", content: "Content here", image: "https://coloradosprings.gov/sites/default/files/styles/page_image/public/pikes_peak_highway.jpg?itok=Kqzh59pj"});

//******************************************************* */
//JWT ROUTES
//******************************************************* */
app.get('/api', (req,res)=>{
    res.json({message: "Welcome to the API"});
});

let server;

function runServer(databaseUrl, port = PORT) {
    return new Promise((resolve, reject)=> {
        mongoose.connect(databaseUrl, err=> {
            if(err) {
                return reject(err);
            }
            server = app.listen(port, ()=>{
                console.log(`Your app is running on port ${port}`);
                resolve();
            })
            .on('error', err=>{
                mongoose.disconnect();
                reject(err);
            });
        });
    });
}

function closeServer() {
    return mongoose.disconnect().then(()=> {
        return new Promise((resolve, reject)=> {
            console.log('Closing server');
            server.close(err=> {
                if(err) {
                    return reject(err);
                }
                resolve();
            });
        });
    });
}

if(require.main === module) {
    runServer(TEST_URL).catch(err=>console.error(err));
}

//this makes public holder files accessible to this app
// app.use(express.static('public'));

// app.listen(process.env.PORT || 8080, function(){
//     console.log("Server started");
// });

module.exports = {runServer, app, closeServer};