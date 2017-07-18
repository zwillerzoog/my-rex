const mongoose = require('mongoose');

const listSchema = mongoose.Schema({
  name: {type: String, required: true},
  date: {type: String, default: ''},
  rating: {type: Number, default: ''}
});

const userSchema = mongoose.Schema({
  username: {type: String, required: true},
  password: {type: String, required: true},
  email: {type: String, required: true},
  myList: [listSchema]
});

userSchema.methods.apiRepr = function() {
  return {
    username: this.username,
    email: this.email,
    myList: this.myList
  };
};

userSchema.methods.listRepr = function() {
  return {
    list: this.myList 
  };
};

const USER = mongoose.model('USER', userSchema);

module.exports = {USER};