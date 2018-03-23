const chai = require('chai');
const chaiHttp = require('chai-http');
const mongoose = require('mongoose');
const faker = require('faker');
const expect = chai.expect;

const {runServer, app, closeServer} = require('../server');
const {User} = require('../models/users');
const {Post} = require('../models/posts');
const {TEST_URL, PORT} = require('../config.js');
chai.use(chaiHttp);

//FUNCTIONS TO SEED DB
function generatePost() {
    return {
        title: faker.lorem.sentence(),
        content: faker.lorem.paragraph(),
        image: faker.image.imageUrl()
    };
}

function makeUser() {
    return {
        username: faker.name.firstName()+faker.name.lastName()
    };
}

function seedData() {
    const seedData = [];
    for(let i = 0; i < 10; i++) {
        seedData.push(generatePost());
    }
    return Post.insertMany(seedData);
}

function tearDownDb() {
    console.warn("Tearing down database");
    return mongoose.connection.dropDatabase();
}

//************************************************ */
//TESTS
//************************************************ */

describe('Posts API resource', function() {
    before(function() {
        return runServer(DATABASE_URL);
    });

    beforeEach(function() {
        return seedData(); 
    });

    afterEach(function() {
        return tearDownDb(); 
    });

    after(function() {
        return closeServer();
    });


    describe('GET endpoint for posts', function() {
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


}); //End of Outermost Describe

    


