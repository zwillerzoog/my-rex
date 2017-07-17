const bodyParser = require('body-parser');
const express = require('express');
const mongoose = require('mongoose');

mongoose.Promise = global.Promise;
const {PORT, DATABASE_URL} = require('./config');
const {USER} = require('./models');

const app = express();
app.use(bodyParser.json());
app.use(express.static('public'));

//Endpoints

app.get('/', (req, res) => {
    console.log("get is happening");
    USER
    .findOne(req.params.name)
    .then(user => res.json(user.apiRepr()))
    .catch(err => {
        console.log("testing")
        res.status(500).json({message: 'Internal error'})
    })
})

app.post('/', (req, res) => {
    console.log("post is happening");
    console.log(req.body.name);
    console.log(req.body.date);
    const requiredFields = ['name'];
    requiredFields.forEach(field => {
        if (! (field in req.body && req.body[field])) {
            res.status(400).json({message: `Need a value for ${field}`});
        }
    });

    USER
        .create({
            username: req.body.username,
            password: req.body.password,
            email: req.body.email,
            name: req.body.name,
            date: req.body.date,
            rating: req.body.rating})
        .then(
            user => res.status(201).json(user.apiRepr()))
        .catch(err => {
            console.log("Post isn't working")
            res.status(500).json({message: 'Internal error from Post'});
        })

})


app.use('*', function(req, res) {
  res.status(404).json({message: 'Not Found'});
});

let server;

function runServer() {
  return new Promise((resolve, reject) => {
    mongoose.connect(DATABASE_URL, err => {
      if (err) {
        return reject(err);
      }
      server = app.listen(PORT, () => {
        console.log(`Your app is listening on port ${PORT}`);
        resolve();
      })
      .on('error', err => {
        mongoose.disconnect();
        reject(err);
      });
    });
  });
}

function closeServer() {
  return mongoose.disconnect().then(() => {
     return new Promise((resolve, reject) => {
       console.log('Closing server');
       server.close(err => {
           if (err) {
               return reject(err);
           }
           resolve();
       });
     });
  });
}

if (require.main === module) {
  runServer().catch(err => console.error(err));
};

module.exports = {app, runServer, closeServer};

// app.listen(process.env.PORT || 8080, () => {
//   console.log(`Your app is listening on port ${process.env.PORT || 8080}`);
// });