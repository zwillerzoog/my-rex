const chai = require('chai');
const chaiHttp = require('chai-http');
const mongoose = require('mongoose');
const mocha = require('mocha');
const faker = require('faker');
const bcrypt = require('bcrypt');

const should = chai.should();

const { USER, LIST } = require('../models');
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
  myList: []
};

function seedUserData() {
  //console.log(userTest);
  return USER.create(userTest);
}

function seedListData() {
  //console.log(listTest);
  const seedData = [];
  for (let i = 1; i <= 10; i++) {
    seedData.push(listTest);
  }
  return LIST.insertMany(seedData);
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

  beforeEach(function() {

    return seedUserData();

  });

  beforeEach(function() {

    return seedListData();
    
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
          return USER.count();
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
          return USER.findById(resUser._id).exec();
        })
        .then(function (users) {
          console.log('users!!!!!!!', users.id)
          console.log('usersunderscore!!!!!!!', JSON.stringify(users._id))
          resUser._id.should.equal(users._id);
          resUser.username.should.equal(users.username);
          resUser.password.should.equal(users.password);
          resUser.email.should.equal(users.email);
        });
    });
  });

});


