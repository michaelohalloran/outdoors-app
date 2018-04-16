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

describe('Posts API resource', function() {

    const username = 'Tommy';
    const password = 'password1234';

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


    xit('should reject bad login, not return Bearer Token', function(done) {
        chai.request(app)
        .post("/api/auth/login")
        .send({username: 'John',password: 'password'})
        .end(function(err, res) {
            expect(res).to.have.status(401);    // <= Test completes before this runs
            done();
          });
    });

    // it('should accept good login, return Bearer Token', function(done) {
    //     chai.request(app)
    //     .post("/api/auth/login")
    //     .send({username: 'Bob', password: 'password1234'})
    //     .end(function(err, res) {
    //         console.log('response is: ', res.statusCode);
    //         expect(res).to.have.status(200);    // <= Test completes before this runs
    //         //TEST FOR TOKEN
    //         expect(res.responseText).to.have.length.of.at.least(1);
    //         done();
    //       });
    // });

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
      });

    //test that gallery loads once user

    xdescribe('GET endpoint for posts', function() {

        //fix to return bearer Token*********

        // beforeEach(function(done){
        //     //login into the system
        //     request
        //     .post("http:localhost:8080/api/auth/login")
        //     .send({username : "John", password : "password"})
        //     .end(function assert(err, res){
        //         if(err){
        //             console.log(err);
        //             done();
        //         }
        //         else{
        //             done();
        //         }
        //     });
        // });

        it('should show return all posts', function() {
            let res;
            return chai.request(app)
            .get('/posts')
            .then(function(_res) {
                res = _res;
                expect(res).to.have.status(200);
                expect(res.body).to.have.length.of.at.least(1);
                return Post.count();
            })
            .then(function(count) {
                expect(res.body).to.have.lengthOf(count);
            });
        }); //end IT GET

        it('should return posts with correct fields', function(){
            let resPost;
            return chai.request(app) 
            .get('/posts')
            .then(function(res){
                expect(res).to.have.status(200)
                expect(res).to.be.json;
                expect(res.body).to.be.a('array');
                expect(res.body).to.have.length.of.at.least(1);

                res.body.forEach(function(post){
                    expect(post).to.be.a('object');
                    expect(post).to.include.keys(
                        'title','content','image');
                });
                resPost = res.body[0];
                return Post.findById(resPost.id);
            })
            .then(function(post){
                expect(resPost.title).to.equal(post.title);
                expect(resPost.content).to.equal(post.content);
                expect(resPost.image).to.equal(post.image);
            });
        }); //end of IT 

    }); //end describe GET endpoint


    xdescribe('POST endpoint', function() {
        it('should add new blog post', function() {
            let newPost = generatePost();
            return chai.request(app)
                .post('/posts')
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


    xdescribe('PUT endpoint', function(){
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
                        .send(updatePost);
                })
                .then(function(res){
                    //204 status means successfully reset doc, no content to return
                    expect(res).to.have.status(204);
                    //find ID of post you just updated, return that as promise to next .then
                    // console.log('updatePost is ' + updatePost.title);
                    return Post.findById(updatePost.id);
                })
                .then(function(post){
                    // console.log('updatePost title is ' + updatePost.title);
                    // console.log('post title is ' + post.title);
                    expect(post.title).to.equal(updatePost.title);
                    expect(post.content).to.equal(updatePost.content);
                    // post.title.should.equal(updateData.title);
                    // post.content.should.equal(updateData.content);
                });
        }); //first PUT it
    }); //PUT describe

}); //End of Outermost Describe

    


