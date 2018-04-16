const chai = require('chai');
const chaiHttp = require('chai-http');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const faker = require('faker');
const bcrypt = require('bcryptjs');

const {runServer, app, closeServer} = require('../server');
const {User} = require('../users/models');
const {Post} = require('../models/posts');
const {DATABASE_URL, TEST_DATABASE_URL, PORT, JWT_SECRET} = require('../config.js');

const expect = chai.expect;
chai.use(chaiHttp);

//FUNCTIONS TO SEED DB
function generatePost() {
    return {
        title: faker.lorem.sentence(),
        content: faker.lorem.paragraph(),
        image: faker.image.imageUrl()
    };
}

// function makeUser(username, password) {
//     let newUser = new User ({
//         username: username,
//         password: password
//     });
//     newUser.save((err)=>{
//         if(err) {
//             throw err;
//         }
//     });
// }

function seedData() {
    const seedData = [];
    for(let i = 0; i < 10; i++) {
        seedData.push(generatePost());
    }
    Post.insertMany(seedData);
    // User.(makeUser("Bob", "password1234"));
    // makeUser("Bob", "$2a$10$BBLqhvvabdL2Bff.h9U2KelBD9gqPcWMQOYOWscPjvA4brB1/5a3C");
}

function tearDownDb() {
    console.warn("Tearing down database");
    return mongoose.connection.dropDatabase();
}

//************************************************ */
//TESTS
//************************************************ */
//initial steps: 
//before: run server, seed Post data, hash a user password and create new user beforeEach, 
//after: remove user, tear down DB, close server

describe('Posts API resource', function() {

    const username = 'Tommy';
    const password = 'password1234';
    const firstName = '';
    const lastName = '';
    
    before(function() {
        return runServer(TEST_DATABASE_URL);
    });

    beforeEach(function() {
        seedData(); 
    });

    beforeEach(function () {
        return User.hashPassword(password).then(password =>
          User.create({
            username,
            password
          })
        );
      });
    
      afterEach(function () {
        return User.remove({});
      });

      afterEach(function() {
        return tearDownDb(); 
    });

    after(function() {
        return closeServer();
    });

    describe('Auth tests', function(){
        it('Should send protected data', function () {

            const token = jwt.sign(
              {
                user: {
                  username,
                }
              },
              JWT_SECRET,
              {
                algorithm: 'HS256',
                subject: username,
                expiresIn: '7d'
              }
            );
      
            return chai
              .request(app)
              .get('/posts')
              .set('authorization', `Bearer ${token}`)
              .then(res => {
                  console.log('res.body.data[0] is: ', res.body.data[0]);
                expect(res).to.have.status(200);
                expect(res.body).to.be.an('object');
              });
          }); //end of IT
    
        it('Should return a valid auth token', function () {
            return chai
              .request(app)
              .post('/api/auth/login')
              .send({ username, password })
              .then(res => {
                // console.log(`res.body is: `, res.body);
                expect(res).to.have.status(200);
                expect(res.body).to.be.an('object');
                const token = res.body.authToken;
                expect(token).to.be.a('string');
                const payload = jwt.verify(token, JWT_SECRET, {
                  algorithm: ['HS256']
                });
                expect(payload.user).to.deep.equal({
                  username,
                  firstName,
                  lastName
                });
              });
        }); //end of IT
   
        it('Should reject requests with incorrect usernames', function () {
            return chai
              .request(app)
              .post('/api/auth/login')
              .send({ username: 'wrongUsername', password })
              .then(() =>
                expect.fail(null, null, 'Request should not succeed')
              )
              .catch(err => {
                if (err instanceof chai.AssertionError) {
                  throw err;
                }
      
                const res = err.response;
                expect(res).to.have.status(401);
              });
        });

        it('Should reject requests with incorrect passwords', function () {
        return chai
            .request(app)
            .post('/api/auth/login')
            .send({ username, password: 'wrongPassword' })
            .then(() =>
            expect.fail(null, null, 'Request should not succeed')
            )
            .catch(err => {
            if (err instanceof chai.AssertionError) {
                throw err;
            }
    
            const res = err.response;
            expect(res).to.have.status(401);
            });
        });
    });
    
    
    describe('GET endpoint', function(){
        //create authToken
        const token = jwt.sign(
            {
              user: {
                username,
              }
            },
            JWT_SECRET,
            {
              algorithm: 'HS256',
              subject: username,
              expiresIn: '7d'
            }
        );

        it('should return all posts', function() {
            let res;
            return chai.request(app)
            .get('/posts')
            .set('authorization', `Bearer ${token}`)
            .then(function(_res) {
                res = _res;
                expect(res).to.have.status(200);
                expect(res.body.data).to.have.length.of.at.least(1);
                return Post.count();
            })
            .then(function(count) {
                expect(res.body.data).to.have.lengthOf(count);
            });
        }); //end IT GET

        it('should return posts with correct fields', function(){
            let resPost;
            return chai.request(app) 
            .get('/posts')
            .set('authorization', `Bearer ${token}`)
            .then(function(res){
                expect(res).to.have.status(200)
                expect(res).to.be.json;
                expect(res.body.data).to.be.a('array');
                expect(res.body.data).to.have.length.of.at.least(1);

                res.body.data.forEach(function(post){
                    expect(post).to.be.a('object');
                    expect(post).to.include.keys(
                        'title','content','image');
                });
                resPost = res.body.data[0];
                return Post.findById(resPost.id);
            })
            .then(function(post){
                expect(resPost.title).to.equal(post.title);
                expect(resPost.content).to.equal(post.content);
                expect(resPost.image).to.equal(post.image);
            });
        }); //end of IT 

    }); //end describe GET endpoint

    
    describe('POST endpoint', function() {
        
        const token = jwt.sign(
            {
              user: {
                username,
              }
            },
            JWT_SECRET,
            {
              algorithm: 'HS256',
              subject: username,
              expiresIn: '7d'
            }
        );
        
        it('should add new blog post', function() {
            let newPost = generatePost();
            return chai.request(app)
                .post('/posts')
                .set('authorization', `Bearer ${token}`)
                .send(newPost)
                .then(function(res){
                    // console.log('newPost author is ' + newPost.author.firstName);
                    // console.log('res body author is ' + res.body.author);

                    //this is "created OK" status
                    expect(res).to.have.status(201);
                    expect(res.body).to.be.a('object');
                    expect(res.body).to.include.keys(
                        'title','content');
                    expect(res.body.content).to.equal(newPost.content);
                    expect(res.body.title).to.equal(newPost.title);
                    expect(res.body.id).to.not.be.null;
                    
                    return Post.findById(res.body.id);
                })
                .then(function(post){
                    expect(post.content).to.equal(newPost.content);
                    expect(post.title).to.equal(newPost.title);
                });
        }); //first POST it
    }); //POST describe


    describe('PUT endpoint', function(){
        const token = jwt.sign(
            {
              user: {
                username,
              }
            },
            JWT_SECRET,
            {
              algorithm: 'HS256',
              subject: username,
              expiresIn: '7d'
            }
        );

        it('should update a Post', function(){
            const updatePost = {
                title: "Updated post",
                content: "Updating this post for a test"
            };

            return Post
                //find random post
                .findOne() 
                .then(function(post){
                    //make your updatedPost = to the id of one you just found
                    updatePost.id = post.id;

                    return chai.request(app)
                        .put(`/posts/${post.id}`)
                        .set('authorization', `Bearer ${token}`)
                        .send(updatePost);
                })
                .then(function(res){
                    console.log('res is', res);
                    console.log('res.body is', res.body);
                    //204 status means successfully reset doc, no content to return
                    expect(res).to.have.status(200);
                    //find ID of post you just updated, return that as promise to next .then
                    // console.log('updatePost is ' + updatePost.title);
                    return Post.findById(updatePost.id);
                })
                .then(function(post){
                    expect(post.title).to.equal(updatePost.title);
                    expect(post.content).to.equal(updatePost.content);
                });
        }); //first PUT it
    }); //PUT describe

    describe('DELETE endpoint', function() {
        const token = jwt.sign(
            {
              user: {
                username,
              }
            },
            JWT_SECRET,
            {
              algorithm: 'HS256',
              subject: username,
              expiresIn: '7d'
            }
        );

        it('should delete a POST', function(){
            //get DB post id, make delete request, check DB to see it's deleted 
            let post;

            return Post 
                .findOne() 
                .then(function(_post) { 
                    //set your post to be deleted equal to _post (what you just found w/findOne)
                    post = _post;
                    return chai.request(app) 
                        .delete(`/posts/${post.id}`)
                        .set('authorization', `Bearer ${token}`);
                })
                //now check that it's deleted by searching for its ID in DB
                .then(function(res){
                    console.log(`res is: `, res)
                    expect(res).to.have.status(200);
                    return Post.findById(post.id);
                })
                .then(function(_post){
                    expect(_post).to.be.null;
                });

        });// end of DELETE it

    }); //DELETE describe


}); //End of Outermost Describe

    


