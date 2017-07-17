const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    username: {type: String, required: true},
    password: {type: String, required: true},
    email: {type: String, required: true},
    myList: [{
        title : {type: String, required: true},
        type: {type: String, required: true},
        date: Date,
        rating: Number
    }]
 });

 userSchema.methods.apiRepr = function() {
     return {
         myList: this.myList
    }
 }

 const USER = mongoose.model('USER', userSchema);

 module.exports = {USER};