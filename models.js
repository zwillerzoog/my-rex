const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    username: {type: String, required: true},
    password: {type: String, required: true},
    email: {type: String, required: true},
    myList: [{
        name: {type: String, required: true},
        date: {type: String, default: ""},
        rating: {type: Number, default: ""}
    }]
 });

 userSchema.methods.apiRepr = function() {
     return {
         myList: [{
            name: this.name,
            date: this.date,
            rating: this.rating
         }]
    }
 }

 const USER = mongoose.model('USER', userSchema);

 module.exports = {USER};