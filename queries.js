const mongoose = require('mongoose');

mongoose.Promise = global.Promise;
const { PORT, DATABASE_URL } = require('./config');
const { USER } = require('./models');

mongoose.connect(DATABASE_URL, () => {

//   USER
//     .findByIdAndUpdate('596e57197b23864b3c305f26',
//       {
//         $push: { myList: { name: 'foo', date: 'blah', rating: 4 } }
//       }, {new: true})
//     .then(
//       results =>
//         console.log(results)
//     )
//     .catch(err => {
//       console.log(err);
//     });

  // USER
  // .create({
  //         username: 'myUser',
  //         password: 'myPass',
  //         email: 'myEmail'
  //     })
  //     .then(
  //         results => 
  //         console.log(results)
  //     )
  //     .catch(err => {
  //         console.log("Post isn't working")
  //         res.status(500).json({message: 'Internal error from Post'});
  //     })


app.get('/api/users/:id', (req, res) => {
  console.log('get by id is happening');
  USER
    .findById(req.params.id)
    .then(user => {
      console.log(user);
      res.status(200).json(user);
    })
    .catch(err => {
      console.log('testing');
      res.status(500).json({message: 'Internal error from GET'});
    });
});


  // get all
  // USER
  // .find()
  // .then(users => {
  //     let list = users.myList;
  //     console.log("string");
  //     console.log(users);
  //     //res.json(list.apiRepr())
  // })
  // .catch(err => {
  //     console.log("testing")
  //     res.status(500).json({message: 'Internal error'})
  // })
  //     //get by id

  //     // update

  //     //delete

  //})

});


