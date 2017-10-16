//Heroku link: https://floating-scrubland-74394.herokuapp.com/

const bodyParser = require('body-parser');
const express = require('express');
const mongoose = require('mongoose');
const fetch = require('node-fetch');
mongoose.Promise = global.Promise;

const passport = require('passport');
const { BasicStrategy } = require('passport-http');
const bcrypt = require('bcrypt');


const { PORT, DATABASE_URL } = require('./config');
const { User } = require('./models');

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

app.use(function (req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  //res.header('Access-Control-Allow-Methods', 'PUT', 'POST', 'GET', 'DELETE');
  next();
});

const basicStrategy = new BasicStrategy(function (username, password, done) {
  let user;
  User
    .findOne({ username: username })

    .then(_user => {
      user = _user;
      if (!user) {
        return done(null, false, { message: 'Incorrect username' });
      }
      return bcrypt.compare(password, user.password);
      //   password === user.password;
    })
    .then(isValid => {
      if (!isValid) {
        return done(null, false, { message: 'Incorrect password' });
      }
      else {
        return done(null, user);
      }
    })
    .catch(err => {
      console.log('error: ', err);
    })
});

passport.use(basicStrategy);
const authenticate = passport.authenticate('basic', { session: false });

//Endpoints

//Get all User objects

app.get('/api/users', (req, res) => {
  User
    .find()
    .then(users => {
      res.status(200).json(users);
    })
    .catch(err => {
      res.status(500).json({ message: 'Internal error from GET' });
    });
});

//Get one unique list object

app.get('/api/users/:id', (req, res) => {
  User
    .findById(req.params.id)
    .then(user => {
      res.status(200).json(user);
    })
    .catch(err => {
      res.status(500).json({ message: 'Internal error from GET' });
    });
});

//Get All endpoint for only the list values

app.get('/api/users/:id/list', (req, res) => {
  User
    .findById(req.params.id)
    .then(user => {
      res.status(200).json(user.myList);
    })
    .catch(err => {
      res.status(500).json({ message: 'Internal error from GET' });
    });
});

//example url
// https://tastedive.com/api/similar?q=pulp+fiction&info=1&k=277024-RestfulA-9WI50A5P

app.post('/api/users/list/', (req, res) => {
  const name = req.body.name;
  //const query = name.replace(/ /g,"+");
  const apiURL = `https://tastedive.com/api/similar?q=${name}&info=1&k=277024-RestfulA-9WI50A5P`;
  return fetch(apiURL, {
    'Content-Type': 'application/json'
  })
    .then(results => {
      return results.json();
    })
    .then(resJson => {
      return res.status(200).send(resJson);

    //         User.
    //   find({
    //     name: results.body


    //   })
    //   return res.status(200).send(resJson)
    // })

      //mongodb query to post/store to database
      //mongodb.find
      //this post stores to myList user
      //find particular user(based off of _id and store in myList)
      //get route (done above)
    })
    .catch(err => {
      console.log({err});
      res.status(500).json({ message: 'Internal error from GET' });
    });
});

app.get('/api/recommendations', (req, res) => {
  let name;
  name = req.body.name;
  //const query = name.replace(/ /g,"+");

  const apiURL = `https://tastedive.com/api/similar?q=${req.query.q}&info=1&k=277024-RestfulA-9WI50A5P`;
  return fetch(apiURL, {
    'Content-Type': 'application/json'
  })
    .then(results => {
      return results.json();
    })
    .then(resJson => {
      return res.status(200).send(resJson);
    })
    .catch(err => {
      res.status(500).json({ message: 'Internal error from GET' });
    });
});

app.get('/api/recommendations/:id', (req, res) => {
  // get the data stored about exactly 1 recommendation 
});

app.post('/api/signup', (req, res) => {
  User
    .create({
      username: req.body.username,
      password: req.body.password,
      email: req.body.email,
      //myList: req.body.myList
    })
    .then(
      results => {
        console.log(results);
        res.status(201).json(results.apiRepr());
      })
    .catch(err => {
      console.log('Post isn\'t working');
      res.status(500).json({ message: 'Internal error from Post' });
    });
});

app.post('/api/:id', authenticate, (req, res) => {
  User
    .findByIdAndUpdate(req.params.id,
      {
      //will be a set. have to delete the older version of the item
        $push: {
          myList: {
            name: req.body.name,
            date: req.body.date,
            rating: req.body.rating
          }
        }
      })
    .then(results => {
      res.status(201).json(results.apiRepr());
    //  res.status(201).send('sent successfully');
    })
    .catch(err => {
      console.log(err);
      res.status(500).send({ message: 'Error from Put' });
    });
});

app.put('/api/users/:id', authenticate, (req, res) => {
});

app.delete('/api/users/:id', authenticate, (req, res) => {
  User
    .findByIdAndRemove(req.params.id)
    .then(result => {
      res.status(204).send({ message: 'Deleted' });
    })
    .catch(err => {
      console.log(err);
      res.status(500).send({ message: 'Error from Delete' });
    });
});





app.use('*', function (req, res) {
  res.status(404).json({ message: 'Not Found' });
});

let server;

function runServer(dbUrl) {
  console.log('HI THERE')
  console.log('dbUrl', dbUrl);
  return new Promise((resolve, reject) => {
    mongoose.connect(dbUrl, err => {
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
  runServer(DATABASE_URL).catch(err => console.error(err));
}

module.exports = { app, runServer, closeServer };
