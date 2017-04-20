// 'use strict'
// var chai = require('chai')

// var mongoose = require("mongoose");
// var User = require("../api/user/users.controller");
// var chaiHttp = require('chai-http');
// var express = require('express');
// var app = express();
// var bodyParser = require('body-parser');
// var morgan = require('morgan');

// process.env.NODE_ENV = 'test';

// app.use(bodyParser.urlencoded({ extended: false }));
// app.use(bodyParser.json());
// app.use(morgan('dev'));

// // mongoose.connect('mongodb://localhost/photoAppDB');

// chai.use(chaiHttp);



// require('../routes')(app)


// //TESTING TIME BABY!


// var addUser = {
//     name: "testUser",
//     password: "password",
//     email: "test@email.com"
// };
// var basPass = {
//     name: "testUser",
//     password: "passw0rd",
//     email: "test@email.com"

// };

// var existingUser = {
//     name: "existingUser",
//     password: "password",
//     email: "existingUser@email.com"

// };

// var token;

// var assert = chai.assert;
// var expect = chai.expect;

// describe('Event Tests', function() {

//     before(function(done) {
//         mongoose.connect('mongodb://localhost/dpb_test');
//         mongoose.connection.dropDatabase()

//         setTimeout(function() {
//             mongoose.connection.collection('events').insert(existingUser)
//         }, 10);
//         setTimeout(function() {
//             chai.request(app)
//                 .post('/api/users/registerNewUser')
//                 .send(addUser)
//                 .end(function(err, res) {
//                     expect(err).to.be.null;
//                     expect(res).to.have.status(200);
//                 });
//             chai.request(app)
//                 .post('/api/users/login')
//                 .send(addUser)
//                 .end(function(err, res) {
//                     expect(err).to.be.null;
//                     expect(res).to.have.status(200);
//                     expect(res.body.token).to.not.be.null;
//                     expect(res.body.token).to.not.be.undefined;

//                     token = res.token;
//                 });

//         }, 100);

//         setTimeout(function() {
//             mongoose.connection.close()
//             done();

//         }, 500);

//     });

//     beforeEach(function(done) {
//         mongoose.connect('mongodb://localhost/dpb_test');
//         done
//     })

//     afterEach(function(done) {
//         mongoose.connection.close()
//         done()
//     });

//     after(function(done) {
//         // runs after all tests in this block
//         mongoose.connection.close()
//         setTimeout(function() {
//             done()
//         }, 10);
//     });



//     describe('#Register()', function() {
//         it("true test", function(done) {
//             expect(true).equal(true)
//         })

//         // it('Should Create on create a user', function(done) {
//         //     chai.request(app)
//         //         .post('/api/users/registerNewUser')
//         //         .send(addUser)
//         //         .end(function(err, res) {
//         //             expect(err).to.be.null;
//         //             expect(res).to.have.status(200);
//         //             done();
//         //         });
//         // })

//         // it('Should Error on create a user', function(done) {
//         //     chai.request(app)
//         //         .post('/api/users/registerNewUser')
//         //         .send(existingUser)
//         //         .end(function(err, res) {
//         //             // expect(err).to.not.be.null;
//         //             expect(res).to.have.status(500);
//         //             done();
//         //         });
//         // })


//     });

//     // describe('#Auth()', function() {

//     //     it('Should login', function(done) {
//     //         chai.request(app)
//     //             .post('/api/users/login')
//     //             .send(addUser)
//     //             .end(function(err, res) {
//     //                 expect(err).to.be.null;
//     //                 expect(res).to.have.status(200);
//     //                 expect(res.body.token).to.not.be.null;
//     //                 expect(res.body.token).to.not.be.undefined;

//     //                 token = res.token;
//     //                 done();
//     //             });
//     //     });


//     //     it('Should error on  login', function(done) {
//     //         chai.request(app)
//     //             .post('/api/users/login')
//     //             .send(basPass)
//     //             .end(function(err, res) {
//     //                 expect(err).to.be.null;
//     //                 expect(res).to.have.status(200);
//     //                 expect(res.body.success).equal(false);
//     //                 expect(res.body.token).to.be.undefined;

//     //                 done();
//     //             });
//     //     });






//     // });
// });
