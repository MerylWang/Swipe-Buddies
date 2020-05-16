process.env.NODE_ENV = 'test';

const User = require('../models/User');
const Event = require('../models/Event');
// const Mat = require('../models/Match')
// const Match = Mat.Match;
// const Matcher = Mat.Matcher;

let app = require("../app.js");
let chai = require('chai');
let chaiHttp = require('chai-http');
let should = chai.should();
let assert = chai.assert;
var expect = chai.expect;

var request = require('supertest');
chai.use(chaiHttp);


describe('Events', () => {

    before(function(done) {
        // delete user so it can be used to testing 
        User.deleteUser('user1');
        User.deleteUser('user2');

        Event.deleteEvent('user1', "2019-12-01")
        
        global.user1 = { username : 'user1', password : 'pass1', role : 'giver' };
        global.user2 = { username : 'user2', password : 'pass2', role : 'giver' };

        global.event1 = {
            day: "2019-12-01", 
            event_data : { "Maseeh":["18:00", "18:30", "19:00"], "Next": ["18:00", "18:30", "19:00"] },
            meal: "breakfast"
        };

        // create users 
        User.createUser(user1.username, user1.password, user1.role);
        User.createUser(user2.username, user2.password, user2.role);

        // log in user1
        global.authenticatedUser = request.agent(app);

        authenticatedUser
            .post('/users/signin')
            .send({ username : user1.username, password : user1.password })
            .end((err, res) => {
                res.should.have.status(200);
                done();
             });
    });

    // create event //
    it('should create event', (done) => {
        authenticatedUser
            .post('/events')
            .send(event1)
            .end((err, res) => {
                res.should.have.status(201);
                done();
            });
    });

    it('should throw 401 when unlogged user signs in', (done) => {
        chai.request(app)
            .post('/events')
            .send(event1)
            .end((err, res) => {
                res.should.have.status(401);
                done();
            });
    });

    // edit time for meal at location //
    it('should edit event time', (done) => {
        authenticatedUser
            .put('/events/availability')
            .send({ day : event1.day, 
                    meal : event1.meal, 
                    location : "Maseeh",
                    newTimes : ["18:00"]
            })
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.a('object');
                
                const expected = ["18:00"]
                const actual = Event.getEventTimes(user1.username, event1.day, event1.meal, "Maseeh")
                expect(actual).to.eql(expected); // passes

                done();
            });
    });

    it('should throw 401 when unlogged user edits time', (done) => {
        chai.request(app)
            .put('/events/availability')
            .send({ day : event1.day, 
                    meal : event1.meal, 
                    location : "Maseeh",
                    newTimes : ["18:00"]
            })
            .end((err, res) => {
                res.should.have.status(401);
                done();
            });
    });

    it('should throw 404 when event not found', (done) => {
        authenticatedUser
            .put('/events/availability')
            .send({ day : "2020-12-01", 
                    meal : event1.meal, 
                    location : "Maseeh",
                    newTimes : ["18:00"]
            })
            .end((err, res) => {
                res.should.have.status(404);
                done();
            });
    });

    // edit meal (location & time) //
    it('should edit event location', (done) => {
        authenticatedUser
            .put('/events/location')
            .send({ 
                day : event1.day, 
                meal : event1.meal, 
                newEvent : { "Simmons" : ["18:00"] }
            })
            .end((err, res) => {
                res.should.have.status(200);

                res.body.should.be.a('object');
                
                const expected = ["Simmons"]
                const actual = Event.getEventLocations(user1.username, event1.day, event1.meal)
                expect(actual).to.eql(expected); // passes

                done();
            });
    });

    it('should throw 401 when unlogged user edits location', (done) => {
        chai.request(app)
            .put('/events/location')
            .send({ 
                day : event1.day, 
                meal : event1.meal, 
                newEvent : { "Simmons" : ["18:00"] }
            })
            .end((err, res) => {
                res.should.have.status(401);
                done();
            });
    });

    it('should throw 404 when event not found', (done) => {
        authenticatedUser
            .put('/events/location')
            .send({ 
                day : "2020-12-01", 
                meal : event1.meal, 
                newEvent : { "Simmons" : ["18:00"] }
            })
            .end((err, res) => {
                res.should.have.status(404);
                done();
            });
    });

    // delete meals for day // 
    it('should delete meals for day', (done) => {
        authenticatedUser
        .delete(`/events/${event1.day}`)
        .end((err, res) => {
            res.should.have.status(200);
            done();
        });
    });

    it('should throw 401 when unlogged user deletes meals', (done) => {
        chai.request(app)
        .delete(`/events/${event1.day}`)
        .end((err, res) => {
            res.should.have.status(401);
            done();
        }); 
    });

    // delete a meal 
    it('should delete one meal', (done) => {
        authenticatedUser
        .delete(`/events/${event1.day}/${event1.meal}`)
        .end((err, res) => {
            res.should.have.status(200);
            done();
        });
    });

    it('should throw 401 when unlogged user deletes a meal ', (done) => {
        chai.request(app)
        .delete(`/events/${event1.day}/${event1.meal}`)
        .end((err, res) => {
            res.should.have.status(401);
            done();
        });
    });
});

