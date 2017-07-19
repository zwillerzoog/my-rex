const mongoose = require('mongoose');

mongoose.Promise = global.Promise;
const { PORT, DATABASE_URL } = require('./config');
const { User } = require('./models');

const {app, runServer, closeServer} = require('./server');

mongoose.connect(DATABASE_URL, () => {

//   User
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

  // User
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


  app.get('/api/users/:userId/list/:listId', (req, res) => {
    console.log('get by id is happening');
    User
      .findById(req.params.id)
      .then(user => {
        console.log(user.myList);

        return fetch (url); 

      // res.status(200).json(user);
      })
      .then(results => {
      res.status(200).json(results);

      })
      .catch(err => {
        console.log('testing');
        res.status(500).json({message: 'Internal error from GET'});
      });
  });

//example url
// https://tastedive.com/api/similar?q=pulp+fiction&info=1&k=277024-RestfulA-9WI50A5P

  app.get('/api/recommendations/:name', (req, res) => {
    console.log('get by id is happening');
    return fetch (`tastedive.com?apikey=12345&name=${req.params.name}`)
      .then(results => {
        res.status(200).json(results);
      })
      .catch(err => {
        console.log('testing');
        res.status(500).json({message: 'Internal error from GET'});
      });
  });

  // get all
  // User
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


