const chai = require('chai');
const chaiHttp = require('chai-http');
const mongoose = require('mongoose');
const mocha = require('mocha');
const faker = require('faker');

const should = chai.should();

const {USER} = require('../models');
const {app, runServer, closeServer} = require('../server');

chai.use(chaiHttp);

function seedUserData() {

}

function seedListData() {
    
}