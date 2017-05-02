'use strict'
var chai = require('chai')

var mongoose = require("mongoose");
var User = require("../api/user/users.controller");
var Event = require("../api/event/events.controller");
var Picture = require("../api/picture/pictures.controller");
var chaiHttp = require('chai-http');
var express = require('express');
var app = express();
var bodyParser = require('body-parser');
// var morgan = require('morgan');

// process.env.NODE_ENV = 'test';

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
// app.use(morgan('dev'));

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

var erroUser = {
    password: "password",
    email: "test123@email.com"
};

var existingUser = {
    _id: mongoose.Types.ObjectId("58f91c488aa0c7dd39fdf82c"),
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
    title: "Testing Event",
    location: "Waterford",
    startTime: "2017-04-13T12:15:00.000Z",
    endTime: "2017-09-30T12:15:00.000Z",
    admin: "123",
    adminId: "123",
    info: "a test event",
    attenders: [{ "numOfPics": 2, "email": "existingUser@email.com", "name": "existingUser", "id": "58f8ff2515d26fd22aced19b", "_id": mongoose.Types.ObjectId("58f91d5de397fcde222cad80") }],
    pictures: [mongoose.Types.ObjectId("58f62b45e9709e26c3105279"), mongoose.Types.ObjectId("58f62b45e9709e26c3105111")],
    iconPicked: "test.png",
    released: true,
    publicEvent: true
}

var newPicture = {
    "_id": mongoose.Types.ObjectId("58f62b45e9709e26c3105279"),
    "name": "userPhoto-1491834159288.jpeg",
    "owner": "58cd4771d8bd330e754a6a4b",
    "location": "/data/images/userPhoto-1491834159288.jpeg",
    "event": "58e256504e27e734f671c2b4",
    "timeStamp": "1491834159288",
    "__v": 0,
    "tagged": ["1", "2"]
}

var testingEvent

var fakeToken = "jwt eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ0b2tlbiI6ImZha2UgdG9rZW4ifQ.fTEBdjLfreRvOafHyBDeO53a-X1d1joCrjxzZfF2xhU"


var token;

var assert = chai.assert;
var expect = chai.expect;
describe('Routes Tests', function() {
    describe("NotARouteTest", function() {

        it("should fail, not a route", function(done) {
            chai.request(app)
                .get("/api/route")
                .end(function(err, res) {
                    expect(err).to.not.be.null
                    expect(res).to.have.status(404)
                    done()
                })
        })
    })

})
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

        it('Should Error on create a user', function(done) {
            chai.request(app)
                .post('/api/users/registerNewUser')
                .send(erroUser)
                .end(function(err, res) {
                    expect(err).to.not.be.null;
                    expect(res).to.have.status(500);
                    done();
                });
        })


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

        it('Should error on login username', function(done) {
            chai.request(app)
                .post('/api/users/login')
                .send({})
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



describe('#getUsers()', function() {

    it('Should get users', function(done) {
        chai.request(app)
            .get('/api/users/')
            .end(function(err, res) {
                expect(err).to.be.null;
                expect(res).to.have.status(200);
                done();
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
            chai.request(app)
                .get("/api/events/")
                .set('Authorization', 'Bearer ' + token)
                .end(function(err, res) {
                    expect(err).to.be.null;
                    expect(res.body.length).equal(1)
                    done()
                })
        })
        it("Should return an error when getting list of events", function(done) {
            chai.request(app)
                .get("/api/events/")
                .set('Authorization', 'Bearer ' + null)
                .end(function(err, res) {
                    expect(err).to.not.be.null;
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
                    testingEvent = res.body
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
            chai.request(app)
                .get("/api/events/")
                .set('Authorization', 'Bearer ' + token)
                .end(function(err, res) {
                    expect(err).to.be.null;
                    expect(res.body.length).equal(2)
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

                    done()
                })
        });

        it("should error on join an event. Token", function(done) {
            chai.request(app)
                .post("/api/events/joinEvent/58f8ff2515d26fd22aced19b")
                .set('Authorization', 'Bearer ' + null)
                .end(function(err, res) {
                    expect(err).to.not.be.null;
                    expect(res).to.have.status(500)
                        // expect(res.body.responce).equal("Update successful")

                    done()
                })
        });

        it("should error on join an event. event ID", function(done) {
            chai.request(app)
                .post("/api/events/joinEvent/123")
                .set('Authorization', 'Bearer ' + null)
                .end(function(err, res) {
                    expect(err).to.not.be.null;
                    expect(res).to.have.status(500)
                        // expect(res.body.responce).equal("Update successful")

                    done()
                })
        });



        it("Should add another event to my list as joined new one", function(done) {
            chai.request(app)
                .get("/api/events/myEvents/123")
                .set('Authorization', 'Bearer ' + token)
                .end(function(err, res) {
                    expect(err).to.be.null;
                    expect(res.body.length).equal(2)
                    expect(res).to.have.status(200)
                    done()
                })
        });
    });

    describe("#eventDetails()", function() {

        it("should return the event", function(done) {
            chai.request(app)
                .get("/api/events/eventDetails/58f8ff2515d26fd22aced19b")
                .set('Authorization', 'Bearer ' + token)
                .end(function(err, res) {
                    expect(err).to.be.null;
                    expect(res).to.have.status(200)
                    expect(res.body.success).equal(true)
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

                    done()
                })
        })
    })
    describe("#hideImgs()", function() {


        it("Should update hide images to false", function(done) {

            chai.request(app)
                .post("/api/events/hideImgs/")
                .set('Authorization', 'Bearer ' + token)
                .send({ _id: "58f8ff2515d26fd22aced19b" })
                .end(function(err, res) {
                    expect(err).to.be.null;
                    expect(res).to.have.status(200)
                    expect(res.body.success).equal(true)

                    done()
                })

        })

        it("Should error on hide images. token", function(done) {

            chai.request(app)
                .post("/api/events/hideImgs/")
                .set('Authorization', 'Bearer ' + null)
                .send({ _id: "58f8ff2515d26fd22aced19b" })
                .end(function(err, res) {
                    expect(err).to.not.be.null;
                    expect(res).to.have.status(500)

                    done()
                })

        })


        it("Should error on set hide images to false. event ID", function(done) {
            chai.request(app)
                .post("/api/events/hideImgs/")
                .set('Authorization', 'Bearer ' + token)
                .send({ _id: "58f8ff2515d26fd22aced000" })
                .end(function(err, res) {
                    // expect(err).to.be.null;
                    expect(res).to.have.status(500)
                    expect(res.body.success).equal(false)

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

                    done()
                })
        })
    })

    // describe("#removeUser()", function(){

    //     it("Should remove a user from an event", function(done) {
    //         chai.request(app)
    //         .post("/api/events/changePublicType/")
    //         .set('Authorization', 'Bearer ' + token)
    //         .send({ _id: "58f8ff2515d26fd22aced19b" })
    //         .end(function(err, res) {
    //             expect(err).to.be.null;
    //             expect(res).to.have.status(200)
    //             expect(res.body.success).equal(true)

    //             done()
    //         })

    //     })

    //     it("Should error on set public to true. token", function(done) {
    //         chai.request(app)
    //         .post("/api/events/changePublicType/")
    //         .set('Authorization', 'Bearer ' + null)
    //         .send({ _id: "58f8ff2515d26fd22aced19b" })
    //         .end(function(err, res) {
    //             expect(err).to.not.be.null;
    //             expect(res).to.have.status(500)

    //             done()
    //         })

    //     })


    //     it("Should error on set public to true. event ID", function(done) {
    //         chai.request(app)
    //         .post("/api/events/changePublicType/")
    //         .set('Authorization', 'Bearer ' + token)
    //         .send({ _id: "58f8ff2515d26fd22aced000" })
    //         .end(function(err, res) {
    //                 // expect(err).to.be.null;
    //                 expect(res).to.have.status(500)
    //                 expect(res.body.success).equal(false)

    //                 done()
    //             })
    //     })

    // })


    describe("#removePicture()", function() {


        it("Should remove a picture from an event", function(done) {

            chai.request(app)
                .post("/api/events/removePicture/")
                .set('Authorization', 'Bearer ' + token)
                .send({ eventId: "58f8ff2515d26fd22aced19b", _id: "58f62b45e9709e26c3105279" })
                .end(function(err, res) {
                    expect(err).to.be.null;
                    expect(res).to.have.status(200)
                    expect(res.body.success).equal(true)

                    done()
                })

        })

        it("Should error on set public to true. token", function(done) {

            chai.request(app)
                .post("/api/events/removePicture/")
                .set('Authorization', 'Bearer ' + null)
                .send({ eventId: "58f8ff2515d26fd22aced19b", _id: "58f62b45e9709e26c3105111" })
                .end(function(err, res) {
                    expect(err).to.not.be.null;
                    expect(res).to.have.status(500)

                    done()
                })

        })

    })
});



describe("Picture Tests", function() {

    before(function(done) {
        setTimeout(function() {
            mongoose.connection.collection('pictures').insert(newPicture)

        }, 100);
        setTimeout(function() {

            done();
        }, 200);

    });

    describe("#getMyPictures()", function() {

        it("Should get my pictures ", function(done) {
            chai.request(app)
                .get("/api/pictures/")
                .set('Authorization', 'Bearer ' + token)
                .end(function(err, res) {
                    expect(err).to.be.null;
                    expect(res).to.have.status(200);
                    done()
                })
        })

        it("should error on get my pictures. token ", function(done) {
            chai.request(app)
                .get("/api/pictures/")
                .set('Authorization', 'Bearer ' + null)
                .end(function(err, res) {
                    expect(err).to.not.be.null;
                    expect(res).to.have.status(500);
                    done()
                })
        })

    })

    describe("#getPicture()", function() {

        it("Should get my pictures ", function(done) {
            chai.request(app)
                .get("/api/pictures/picture/58f62b45e9709e26c3105279")
                .set('Authorization', 'Bearer ' + token)
                .end(function(err, res) {
                    expect(err).to.be.null;
                    expect(res).to.have.status(200);
                    done()
                })
        })

        it("should error on get my pictures. token ", function(done) {
            chai.request(app)
                .get("/api/pictures/picture/58f62b45e9709e26c3105279")
                .set('Authorization', 'Bearer ' + null)
                .end(function(err, res) {
                    expect(err).to.not.be.null;
                    expect(res).to.have.status(500);
                    done()
                })
        })

        it("should error on get my pictures. picture id ", function(done) {
            chai.request(app)
                .get("/api/pictures/picture/58f62b45e9709e26c3105000")
                .set('Authorization', 'Bearer ' + token)
                .end(function(err, res) {
                    expect(err).to.not.be.null;
                    expect(res).to.have.status(500);
                    done()
                })
        })

    })

    describe("#tagfaces()", function() {

        it("it should add new tag faces ", function(done) {
            chai.request(app)
                .post("/api/pictures/tagfaces")
                .set('Authorization', 'Bearer ' + token)
                .send({ picId: "58f62b45e9709e26c3105279", names: ["1", "2", "3"] })
                .end(function(err, res) {
                    expect(err).to.be.null;
                    expect(res).to.have.status(200);
                    done()
                })
        })



        it("it shoud error tag faces ", function(done) {
            chai.request(app)
                .post("/api/pictures/tagfaces")
                .set('Authorization', 'Bearer ' + token)
                .send({ picId: "58f62b45e9709e26c31000000", names: ["1", "2", "3"] })
                .end(function(err, res) {
                    expect(res).to.have.status(500);
                    expect(err).to.not.be.null;
                    done()
                })
        })

        it("it shoud error tag faces ", function(done) {
            chai.request(app)
                .post("/api/pictures/tagfaces")
                .set('Authorization', 'Bearer ' + null)
                .send({ picId: "58f62b45e9709e26c3105279", names: ["1", "2", "3"] })
                .end(function(err, res) {
                    expect(res).to.have.status(500);
                    expect(err).to.not.be.null;
                    done()
                })
        })


        it("it shoud error tag faces ", function(done) {
            chai.request(app)
                .post("/api/pictures/tagfaces")
                .set('Authorization', 'Bearer ' + null)
                .send({ picId: "58f62b45e9709e26c3105279", names: null })
                .end(function(err, res) {
                    expect(res).to.have.status(500);
                    expect(err).to.not.be.null;
                    done()
                })
        })
    })

    describe("#getTags()", function() {

        it("Should get my pictures ", function(done) {
            chai.request(app)
                .get("/api/pictures/tags/58f62b45e9709e26c3105279")
                .set('Authorization', 'Bearer ' + token)
                .end(function(err, res) {
                    expect(err).to.be.null;
                    expect(res).to.have.status(200);
                    done()
                })
        })

        it("should error on get my pictures. token ", function(done) {
            chai.request(app)
                .get("/api/pictures/tags/58f62b45e9709e26c3105279")
                .set('Authorization', 'Bearer ' + null)
                .end(function(err, res) {
                    expect(err).to.not.be.null;
                    expect(res).to.have.status(500);
                    done()
                })
        })

        it("should error on get my pictures. picture id ", function(done) {
            chai.request(app)
                .get("/api/pictures/tags/58f62b45e9709e26c3105000")
                .set('Authorization', 'Bearer ' + token)
                .end(function(err, res) {
                    expect(err).to.not.be.null;
                    expect(res).to.have.status(500);
                    done()
                })
        })

    })


})



// router.delete('/:id', controller.destroy);
// router.get('/tags/:id', controller.gettags);
