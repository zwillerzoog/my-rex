const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

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

//prevents rehashing of password on update
userSchema.pre('save', function(next){
  if (this.isModified('password')) {
    this.password = this._hashPassword(this.password);
    return next();
  }
  return next();
});

//Automatically hashes USER password if password is updated
userSchema.methods._hashPassword = function(password) {
  return bcrypt.hashSync(password, 12);
};

userSchema.methods.apiRepr = function() {
  return {
    _id: this._id,
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

const User = mongoose.model('User', userSchema);

module.exports = {User};