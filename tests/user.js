process.env.NODE_ENV = 'test';

const User = require('../models/User');
const Event = require('../models/Event');

let app = require("../app.js");
let chai = require('chai');
let chaiHttp = require('chai-http');
let should = chai.should();

var request = require('supertest');
chai.use(chaiHttp);

describe('Users', () => {
    before(function() {
        global.authenticatedUser = request.agent(app);

        // delete user so it can be used for testing 
        User.deleteUser("new");
        User.deleteUser("alice");
      });

    // create user // 
    it ('should create account', (done) => {
        chai.request(app)
            .post('/users')
            .send({ username: 'new', password : '123', role : 'receiver' })
            .end((err, res) => {
                res.should.have.status(201);
                res.body.should.be.a('object');
                done();
            });
    });

    it ('should throw 409 when creating account with username taken', (done) => {
        chai.request(app)
            .post('/users')
            .send({ username : 'new', password : 'secure', role: 'giver' })
            .end((err, res) => {
                res.should.have.status(409);
                done();
            });
    });

    // sign in // 
    it ('should throw 404 when user is not found', (done) => {
        authenticatedUser
            .post('/users/signin')
            .send({ username: 'alice', password : '456' })
            .end((err, res) => {
                res.should.have.status(404);
                done();
          });
    });

    it ('should throw 401 when user password does not match', (done) => {
        authenticatedUser
            .post('/users/signin')
            .send({ username: 'new', password : '456' })
            .end((err, res) => {
                res.should.have.status(401);
                done();
          });
    });
    
    it ('should log in', (done) => {
        authenticatedUser
            .post('/users/signin')
            .send({ username: 'new', password : '123' })
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.a('object'); // session
                res.body.should.have.property('username').not.eql(undefined);
                done();
              });
    });

    // update reputation 
    it ('should update user reputation', (done) => {
        authenticatedUser
            .post('/users/reputation')
            .send( { role : 'receiver', delta : '10'})
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.a('object');
                done();
          });
    });


    // get reputation 
    it ('should get user reputation', (done) => {
        authenticatedUser
            .get('/users/reputation/new')
            .end((err, res) => {
                res.should.have.status(200);
                res.body.reputation.should.equal(110);
                done();
          });
    });

    // change role 
    it ('should change user role', (done) => {
        authenticatedUser
            .put('/users/role')
            .send({ newRole : 'giver' })
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.a('object');
                res.body.should.have.property('role').eql('giver');
                done();
            });
    });

    // log out 
    it ('should log out', (done) => {
        authenticatedUser
            .post('/users/signout')
            .end((err, res) => {
                res.should.have.status(200);
                done();
            });
    });
    
});
