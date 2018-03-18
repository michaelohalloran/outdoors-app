const chai = require('chai');
const chaiHttp = require('chai-http');
const mongoose = require('mongoose');
const expect = chai.expect;

const {app} = require('../server');
chai.use(chaiHttp);

describe('GET endpoint', function() {
    it('should show root route page', function() {
        return chai.request(app)
        .get('/')
        .then(function(res) {
            expect(res).to.have.status(200);
        });
    }); //end IT
}); //end describe