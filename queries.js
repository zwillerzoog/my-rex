const mongoose = require('mongoose');

mongoose.Promise = global.Promise;
const { PORT, DATABASE_URL } = require('./config');
const { USER } = require('./models');

//mongoose.connect(DATABASE_URL, () => {

    // USER
    // .findByIdAndUpdate('596e29d06a01615b709d3f71', 
    //     {
    //     $push: {myList: {name: 'foo', date: '', rating:0}}
    //     })
    //     .then(
    //         results => console.log(results)
    //     )
    //     .catch(err => {
    //         console.log(err);
    //     })

   // USER
    // .create({
    //         username: 'myusername',
    //         password: 'mypassword',
    //         email: 'myemail'
    //     })
    //     .then(
    //         results => console.log(results)
    //     )
    //     .catch(err => {
    //         console.log("Post isn't working")
    //         res.status(500).json({message: 'Internal error from Post'});
    //     })
    
    //get all
//     USER
//     .findById('596e29d06a01615b709d3f71')
//     .then(users => {
//         let list = users.myList;
//         //console.log(users.myList);
//         //res.json(list.apiRepr())
//     })
//     .catch(err => {
//         console.log("testing")
//         //res.status(500).json({message: 'Internal error'})
//     })
//     //get by id
    
//     // update
    
//     //delete

// })



