//Heroku link: https://floating-scrubland-74394.herokuapp.com/

const bodyParser = require('body-parser');
const express = require('express');
const mongoose = require('mongoose');

mongoose.Promise = global.Promise;
const {PORT, DATABASE_URL} = require('./config');
const {USER} = require('./models');

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}))
app.use(express.static('public'));

//Endpoints

app.get('/api', (req, res) => {
    console.log("get is happening");
    USER
        .findById('596e29d06a01615b709d3f71')
        .then(users => {
            let list = users.myList;
            console.log(users.myList);
            res.status(200).json(list.apiRepr());
        })
        .catch(err => {
            console.log("testing")
            res.status(500).json({message: 'Internal error from GET'})
    })
})

app.post('/api', (req, res) => {
    console.log("post is happening");
    console.log(req.body);
    console.log(req.body.date);
    const requiredFields = ['username', 'password', 'email'];
    requiredFields.forEach(field => {
        if (! (field in req.body && req.body[field])) {
            res.status(400).json({message: `Need a value for ${field}`});
        }
    });
    USER
    .create({
            username: req.body.username,
            password: req.body.password,
            email: req.body.email
        })
        .then(
            results => {
                console.log(results)
                res.status(201).json(results.apiRepr())
            })
        .catch(err => {
            console.log("Post isn't working")
            res.status(500).json({message: 'Internal error from Post'});
        })
})

app.put('/api', (req, res) => {
    USER
        .findByIdAndUpdate('596e29d06a01615b709d3f71', 
        {
            $push: {myList: {
                        name: req.body.name, 
                        date: req.body.date, 
                        rating:req.body.rating
                        }
                    }
        })
        .then(results => {
            console.log(results);
            res.status(204);
        })
        .catch(err => {
            console.log(err);
            res.status(500).send({message: "Error from Put"});
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