const chai = require('chai');
const chaiHttp = require('chai-http');
const mongoose = require('mongoose');
const mocha = require('mocha');
const faker = require('faker');
const bcrypt = require('bcrypt');

const should = chai.should();

const { User } = require('../models');
const { app, runServer, closeServer } = require('../server');
const { TEST_DATABASE_URL } = require('../config');

chai.use(chaiHttp);

function generateRating() {
  const ratings = [1, 2, 3, 4, 5];
  return ratings[Math.floor(Math.random() * ratings.length)];
}

const listTest = {
  name: faker.lorem.sentence(),
  date: faker.date.past(),
  rating: generateRating()
};

const userTest = {
  username: faker.internet.userName(),
  password: 'test',
  email: faker.internet.email(),
  myList: [listTest, listTest, listTest]
};

let testUser;
function seedUserData() {
  return User.create(userTest).then((user) => testUser = user);
}

function tearDownDb() {
  return new Promise((resolve, reject) => {
    console.warn('Deleting database');
    mongoose.connection.dropDatabase()
      .then(result => resolve(result))
      .catch(err => reject(err));
  });
}

describe('My Rex API Resource', function () {
  before(function () {
    return runServer(TEST_DATABASE_URL);
  });

  beforeEach(function () {
    return seedUserData();
  });

  afterEach(function () {
    return tearDownDb();
  });

  after(function () {
    return closeServer();
  });

  describe('GET ALL endpoint', function () {
    it('should return all existing posts', function () {
      let res;
      return chai.request(app)
        .get('api/users')
        .then(_res => {
          res = _res;
          res.should.have.status(200);
          res.body.should.have.lengthOf.at.least(1);
          return User.count();
        })
        .then(count => {
          res.body.should.have.lengthOf(count);
        })
        .catch((err) => {
          console.log('error', err);
        });
    });

    it('should return users with right fields', function () {
      // Strategy: Get back all users, and ensure they have expected keys

      let resUser;
      return chai.request(app)

        .get('/api/users')
        .then(function (res) {
          res.should.have.status(200);
          res.should.be.json;
          //res.body console works... dotuser comes up undefined
          //res.body.user.should.be.a('array');
          //res.body.user.should.have.length.of.at.least(1);

          res.body.forEach(function (users) {
            users.should.be.a('object');
            users.should.include.keys(
              'username', 'password', 'email');
          });
          resUser = res.body[0];
          return User.findById(resUser._id).exec();
        })
        .then(function (users) {
          resUser._id.should.equal(users.id);
          resUser.username.should.equal(users.username);
          resUser.password.should.equal(users.password);
          resUser.email.should.equal(users.email);
        });
    });

    it('should return a specific user\'s list with right fields', function () {
      // Strategy: Get back all users, and ensure they have expected keys
      let resList;
      return chai.request(app)

        .get(`/api/users/${testUser.id}/list`)
        .then(function (res) {
          res.should.have.status(200);
          res.should.be.json;
          //res.body console works... dotuser comes up undefined
          //res.body.user.should.be.a('array');
          //res.body.user.should.have.length.of.at.least(1);

          res.body.forEach(function (list) {
            list.should.be.a('object');
            list.should.include.keys(
              'name', 'date', 'rating');
          });
          resList = res.body[0];
          return User.findById(testUser.id).exec();
        })
        .then(function (user) {
          let list = user.myList[0];
          resList._id.should.equal(list.id);
          resList.name.should.equal(list.name);
          resList.date.should.equal(list.date);
          resList.rating.should.equal(list.rating);
        });
    });

    describe('POST Endpoint', function () {
      it.only('should create a new user', function () {

        return chai.request(app)
          .post('/api/signup')
          .send(userTest)
          .then(function (res) {
            console.log('res!!!', res.body.id)
            res.should.have.status(201);
            res.should.be.json;
            res.body.should.be.a('object');
            res.body.should.include.keys(
              'username', 'email', 'myList');
            res.body.username.should.equal(userTest.username);
            res.body.email.should.equal(userTest.email);
            return User.findById(res.body.id);
          })
          .then(function (user) {
            // console.log('USER&^&^^&^', user);
            // console.log('USERTEST&^&^^&^', userTest);
          //   user.username.should.equal(userTest.username);
          //   user.email.should.equal(userTest.email);
          //   user.myList.should.equal(userTest.myList);
          });
      });
    });

  });

});

