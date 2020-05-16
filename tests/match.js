process.env.NODE_ENV = 'test';

const User = require('../models/User');
const Event = require('../models/Event');
const Match = require('../models/Match').Match;
const Matcher = require('../models/Match').Matcher;

let app = require("../app.js");
let chai = require('chai');
let chaiHttp = require('chai-http');
let should = chai.should();
let assert = chai.assert;
var expect = chai.expect;

var request = require('supertest');
chai.use(chaiHttp);

describe('Matches',() => {
    before(function(done) {

        global.user1 = { username : 'user1', password : 'pass1', role : 'giver' };
        global.user2 = { username : 'user2', password : 'pass2', role : 'receiver' };

        global.event1 = {
            day: "2019-12-01", 
            event_data : { "Maseeh":["18:00", "18:30", "19:00"], "Next": ["18:00", "18:30", "19:00"] },
            meal: "breakfast"
        };

        // will this fix the 'undefined'
        chai.request(app)
            .get('/init')
            .end((err, res) => {
                res.should.have.status(200);
             });

        // create users 
        User.createUser(user1.username, user1.password, user1.role);
        User.createUser(user2.username, user2.password, user2.role);

        // create events 
        Event.createEvent(user1.username, event1.day, event1.meal, event1.event_data); 
        Event.createEvent(user2.username, event1.day, event1.meal, event1.event_data);

        done();
    });

    it('should run Match.match()', (done) => {
        chai.request(app)
        .get(`/matches/day/${event1.day}`)
        .end((err, res) => {
            console.log('match: ', res.body)
            res.should.have.status(200);
            done();
         });

    });
});