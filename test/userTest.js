'use strict'
var chai = require('chai')

var mongoose = require("mongoose");
var User = require("../api/user/users.controller");
var Event = require("../api/event/events.controller");
var chaiHttp = require('chai-http');
var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var morgan = require('morgan');

// process.env.NODE_ENV = 'test';

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(morgan('dev'));

mongoose.connect('mongodb://localhost/dpb_test');
// mongoose.connect('mongodb://localhost/photoAppDB');

chai.use(chaiHttp);


// get our request parameters



require('../routes')(app)


//TESTING TIME BABY!


var addUser = {
    name: "testUser",
    password: "password",
    email: "test@email.com"
};
var badPass = {
    name: "testUser",
    password: "passw0rd",
    email: "test@email.com"

};
var badUser = {
    name: "testUser",
    password: "password",
    email: "test123@email.com"

};

var existingUser = {
    name: "existingUser",
    password: "password",
    email: "existingUser@email.com"

};

var newEvent = {
    title: "A test Event",
    location: "Waterford",
    startTime: "2017-04-13T12:15:00.000Z",
    endTime: "2017-09-30T12:15:00.000Z",
    admin: "123",
    info: "a test event",
    attenders: [],
    pictures: [],
    iconPicked: "test.png",
    released: true,
    publicEvent: true
}

var existingEvent = {
    _id: mongoose.Types.ObjectId("58f8ff2515d26fd22aced19b"),
    title: "A test Event",
    location: "Waterford",
    startTime: "2017-04-13T12:15:00.000Z",
    endTime: "2017-09-30T12:15:00.000Z",
    admin: "123",
    adminId: "123",
    info: "a test event",
    attenders: [],
    pictures: [],
    iconPicked: "test.png",
    released: true,
    publicEvent: true
}


var token;

var assert = chai.assert;
var expect = chai.expect;

describe('User Tests', function() {

    before(function(done) {
        mongoose.connection.dropDatabase()

        setTimeout(function() {
            mongoose.connection.collection('users').insert(existingUser)
        }, 100);
        setTimeout(function() {

            done();
        }, 200);

    });




    describe('#Register()', function() {

        it('Should Create on create a user', function(done) {
            chai.request(app)
                .post('/api/users/registerNewUser')
                .send(addUser)
                .end(function(err, res) {
                    expect(err).to.be.null;
                    expect(res).to.have.status(200);
                    done();
                });
        })

        // it('Should Error on create a user', function(done) {
        //     chai.request(app)
        //         .post('/api/users/registerNewUser')
        //         .send(existingUser)
        //         .end(function(err, res) {
        //             // expect(err).to.not.be.null;
        //             expect(res).to.have.status(500);
        //             done();
        //         });
        // })


    });

    describe('#Auth()', function() {

        it('Should login', function(done) {
            chai.request(app)
                .post('/api/users/login')
                .send(addUser)
                .end(function(err, res) {
                    expect(err).to.be.null;
                    expect(res).to.have.status(200);
                    expect(res.body.token).to.not.be.null;
                    expect(res.body.token).to.not.be.undefined;
                    token = res.body.token;
                    done();
                });
        });


        it('Should error on login password', function(done) {
            chai.request(app)
                .post('/api/users/login')
                .send(badPass)
                .end(function(err, res) {
                    expect(err).to.be.null;
                    expect(res).to.have.status(200);
                    expect(res.body.success).equal(false);
                    expect(res.body.token).to.be.undefined;
                    done();
                });
        });


        it('Should error on login username', function(done) {
            chai.request(app)
                .post('/api/users/login')
                .send(badUser)
                .end(function(err, res) {
                    expect(err).to.be.null;
                    expect(res).to.have.status(200);
                    expect(res.body.success).equal(false);
                    expect(res.body.token).to.be.undefined;
                    done();
                });
        });
    });
});



describe("Event Testing", function() {

    before(function(done) {

        setTimeout(function() {
            mongoose.connection.collection('events').insert(existingEvent)

        }, 100);
        setTimeout(function() {

            done();
        }, 200);

    });

    describe("#getEvents()", function() {
        this.timeout(5000)

        it("Should return a list of events", function(done) {
            // console.log(token)
            chai.request(app)
                .get("/api/events/")
                .set('Authorization', 'Bearer ' + token)
                .end(function(err, res) {
                    expect(err).to.be.null;
                    expect(res.body.length).equal(1)
                        // console.log("err is", err)
                        // console.log("res is", res.body)
                    done()
                })
        })
        it("Should return an error when getting list of events", function(done) {
            // console.log(token)
            chai.request(app)
                .get("/api/events/")
                .set('Authorization', 'Bearer ' + null)
                .end(function(err, res) {
                    expect(err).to.not.be.null;
                    // console.log("err is", err)
                    // console.log("res is", res.body)
                    done()
                })
        })


    })

    describe("#getMyEvents()", function() {
        this.timeout(5000)

        it("Should return null", function(done) {
            chai.request(app)
                .get("/api/events/myEvents/123")
                .set('Authorization', 'Bearer ' + token)
                .end(function(err, res) {
                    expect(err).to.be.null;
                    expect(res.body.length).equal(0)
                    expect(res).to.have.status(200)
                        // console.log("err is", err)
                        // console.log("res is", res.body)
                    done()
                })

        })


    })

    describe("#CreateEvent()", function() {
        this.timeout(5000)

        it("Should add event to database", function(done) {
            chai.request(app)
                .post("/api/events/")
                .set('Authorization', 'Bearer ' + token)
                .send(newEvent)
                .end(function(err, res) {
                    expect(res).to.have.status(201)
                    expect(err).to.be.null;
                    done()

                })
        })

        it("Should error on create event. Token", function(done) {
            chai.request(app)
                .post("/api/events/")
                .set('Authorization', 'Bearer ' + null)
                .send(newEvent)
                .end(function(err, res) {
                    expect(res).to.have.status(500)
                    expect(err).to.not.be.null;
                    done()

                })
        })

        it("Should error on create event. req.body", function(done) {
            chai.request(app)
                .post("/api/events/")
                .set('Authorization', 'Bearer ' + token)
                .send({ title: "not real event" })
                .end(function(err, res) {
                    expect(res).to.have.status(500)
                    expect(err).to.not.be.null;
                    done()

                })
        })


        it("Should return a list of events, with newly created one", function(done) {
            // console.log(token)
            chai.request(app)
                .get("/api/events/")
                .set('Authorization', 'Bearer ' + token)
                .end(function(err, res) {
                    expect(err).to.be.null;
                    expect(res.body.length).equal(2)
                        // console.log("err is", err)
                        // console.log("res is", res.body)
                    done()
                })
        })


        it("Should return newly created event", function(done) {
            chai.request(app)
                .get("/api/events/myEvents/123")
                .set('Authorization', 'Bearer ' + token)
                .end(function(err, res) {
                    expect(err).to.be.null;
                    expect(res.body.length).equal(1)
                    expect(res).to.have.status(200)
                        // console.log("err is", err)
                        // console.log("res is", res.body)
                    done()
                })

        })

    })


    describe("#JoinEvent()", function() {
        this.timeout(5000)


        it("should join me to an event.", function(done) {
            chai.request(app)
                .post("/api/events/joinEvent/58f8ff2515d26fd22aced19b")
                .set('Authorization', 'Bearer ' + token)
                .end(function(err, res) {
                    expect(err).to.be.null;
                    expect(res).to.have.status(200)
                    expect(res.body.responce).equal("Update successful")

                    // console.log("err is", err)
                    // console.log("res is", res.body)
                    done()
                })
        })

        it("should error on join an event. Token", function(done) {
            chai.request(app)
                .post("/api/events/joinEvent/58f8ff2515d26fd22aced19b")
                .set('Authorization', 'Bearer ' + null)
                .end(function(err, res) {
                    expect(err).to.not.be.null;
                    expect(res).to.have.status(500)
                        // expect(res.body.responce).equal("Update successful")

                    // console.log("err is", err)
                    // console.log("res is", res.body)
                    done()
                })
        })

        it("should error on join an event. event ID", function(done) {
            chai.request(app)
                .post("/api/events/joinEvent/123")
                .set('Authorization', 'Bearer ' + null)
                .end(function(err, res) {
                    expect(err).to.not.be.null;
                    expect(res).to.have.status(500)
                        // expect(res.body.responce).equal("Update successful")

                    // console.log("err is", err)
                    // console.log("res is", res.body)
                    done()
                })
        })



        it("Should add another event to my list as joined new one", function(done) {
            chai.request(app)
                .get("/api/events/myEvents/123")
                .set('Authorization', 'Bearer ' + token)
                .end(function(err, res) {
                    expect(err).to.be.null;
                    expect(res.body.length).equal(2)
                    expect(res).to.have.status(200)
                        // console.log("err is", err)
                        // console.log("res is", res.body)
                    done()
                })

        })
    })

    describe("#eventDetails()", function() {

        it("should return the event", function(done) {
            chai.request(app)
                .get("/api/events/eventDetails/58f8ff2515d26fd22aced19b")
                .set('Authorization', 'Bearer ' + token)
                .end(function(err, res) {
                    expect(err).to.be.null;
                    expect(res).to.have.status(200)
                    expect(res.body.success).equal(true)
                        // console.log("err is", err)
                        // console.log("res is", res.body)
                    done()
                })

        })

        it("should erro on getting the event", function(done) {
            chai.request(app)
                .get("/api/events/eventDetails/58f8ff2515d26fd22aced000")
                .set('Authorization', 'Bearer ' + token)
                .end(function(err, res) {
                    expect(err).to.not.be.null;
                    expect(res).to.have.status(500)
                    expect(res.body.success).equal(false)
                        // console.log("err is", err)
                        // console.log("res is", res.body)
                    done()
                })

        })
    })


    describe("#releaseImgs()", function() {


        it("Should update released to true", function(done) {

            chai.request(app)
                .post("/api/events/releaseImgs/")
                .set('Authorization', 'Bearer ' + token)
                .send({ _id: "58f8ff2515d26fd22aced19b" })
                .end(function(err, res) {
                    expect(err).to.be.null;
                    expect(res).to.have.status(200)
                    expect(res.body.success).equal(true)

                    // console.log("err is", err)
                    // console.log("res is", res.body)
                    done()
                })

        })

        it("Should error on set released to true. token", function(done) {

            chai.request(app)
                .post("/api/events/releaseImgs/")
                .set('Authorization', 'Bearer ' + null)
                .send({ _id: "58f8ff2515d26fd22aced19b" })
                .end(function(err, res) {
                    expect(err).to.not.be.null;
                    expect(res).to.have.status(500)

                    done()
                })

        })


        it("Should error on set released to true. event ID", function(done) {
            chai.request(app)
                .post("/api/events/releaseImgs/")
                .set('Authorization', 'Bearer ' + token)
                .send({ _id: "58f8ff2515d26fd22aced000" })
                .end(function(err, res) {
                    // expect(err).to.be.null;
                    expect(res).to.have.status(500)
                    expect(res.body.success).equal(false)

                    // console.log("err is", err)
                    // console.log("res is", res.body)
                    done()
                })
        })
    })


    describe("#changePublicType()", function() {


        it("Should update public to true", function(done) {

            chai.request(app)
                .post("/api/events/changePublicType/")
                .set('Authorization', 'Bearer ' + token)
                .send({ _id: "58f8ff2515d26fd22aced19b" })
                .end(function(err, res) {
                    expect(err).to.be.null;
                    expect(res).to.have.status(200)
                    expect(res.body.success).equal(true)

                    // console.log("err is", err)
                    // console.log("res is", res.body)
                    done()
                })

        })

        it("Should error on set public to true. token", function(done) {

            chai.request(app)
                .post("/api/events/changePublicType/")
                .set('Authorization', 'Bearer ' + null)
                .send({ _id: "58f8ff2515d26fd22aced19b" })
                .end(function(err, res) {
                    expect(err).to.not.be.null;
                    expect(res).to.have.status(500)

                    done()
                })

        })


        it("Should error on set public to true. event ID", function(done) {
            chai.request(app)
                .post("/api/events/changePublicType/")
                .set('Authorization', 'Bearer ' + token)
                .send({ _id: "58f8ff2515d26fd22aced000" })
                .end(function(err, res) {
                    // expect(err).to.be.null;
                    expect(res).to.have.status(500)
                    expect(res.body.success).equal(false)

                    // console.log("err is", err)
                    // console.log("res is", res.body)
                    done()
                })
        })
    })










})
