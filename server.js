//Heroku link: https://floating-scrubland-74394.herokuapp.com/

const bodyParser = require('body-parser');
const express = require('express');
const mongoose = require('mongoose');
const fetch = require('node-fetch');

const passport = require('passport');
const { BasicStrategy } = require('passport-http');
const bcrypt = require('bcrypt');

mongoose.Promise = global.Promise;
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
  console.log(username, 'username');
  User
    .findOne({ username: username })

    .then(_user => {
      user = _user;
      if (!user) {
        return done(null, false, { message: 'Incorrect username' });
      }
      //console.log('bcrypt', bcrypt.compare(password, user.password));
      return bcrypt.compare(password, user.password);
      //   password === user.password;
    })
    .then(isValid => {
      console.log('isValid', isValid);
      if (!isValid) {
        return done(null, false, { message: 'Incorrect password' });
      }
      else {
        return done(null, user);
      }
    });
});

passport.use(basicStrategy);
const authenticate = passport.authenticate('basic', { session: false });

//Endpoints

//Get all User objects

app.get('/api/users', (req, res) => {
  console.log('get all is happening');
  User
    .find()
    .then(users => {
      console.log(users);
      res.status(200).json(users);
    })
    .catch(err => {
      console.log('testing');
      res.status(500).json({ message: 'Internal error from GET' });
    });
});

//Get one unique list object

app.get('/api/users/:id', (req, res) => {
  console.log('get by id is happening');
  User
    .findById(req.params.id)
    .then(user => {
      console.log(user);
      res.status(200).json(user);
    })
    .catch(err => {
      console.log('testing');
      res.status(500).json({ message: 'Internal error from GET' });
    });
});

//Get All endpoint for only the list values

app.get('/api/users/:id/list', (req, res) => {
  console.log('get by id is happening');
  User
    .findById(req.params.id)
    .then(user => {
      console.log(user);
      res.status(200).json(user.myList);
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({ message: 'Internal error from GET' });
    });
});

//example url
// https://tastedive.com/api/similar?q=pulp+fiction&info=1&k=277024-RestfulA-9WI50A5P

app.post('/api/users/list/', (req, res) => {
  console.log('get recommendations is happening');
  const name = req.body.name;
  //const query = name.replace(/ /g,"+");
  //console.log(query);
  const apiURL = `https://tastedive.com/api/similar?q=${name}&info=1&k=277024-RestfulA-9WI50A5P`;
  return fetch(apiURL, {
    'Content-Type': 'application/json'
  })
    .then(results => {
      console.log('results', results.body);
      return results.json();
    })
    .then(resJson => {
      //console.log(resJson)

      

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

app.post('/api/recommendations/', (req, res) => {
  console.log('get recommendations is happening');
  let name;
  name = req.body.name;
  //const query = name.replace(/ /g,"+");
  console.log('=====', req.body);
  const apiURL = `https://tastedive.com/api/similar?q=${name}&info=1&k=277024-RestfulA-9WI50A5P`;
  console.log(apiURL)
  return fetch(apiURL, {
    'Content-Type': 'application/json'
  })
    .then(results => {
      console.log('results', results.body);
      return results.json();
    })
    .then(resJson => {
      console.log(resJson)
      return res.status(200).send(resJson);
    })
    .catch(err => {
      console.log({err});
      res.status(500).json({ message: 'Internal error from GET' });
    });
});


app.post('/api/signup', (req, res) => {
  console.log('post is happening');
  console.log(req.body);
  //console.log(req.body.date);


 //// ????? UNCOMMENT THIS ??????????????????????????????????????????????????????????????????????????????
  // const requiredFields = ['username', 'password', 'email'];
  // requiredFields.forEach(field => {
  //   if (!(field in req.body && req.body[field])) {
  //     res.status(400).json({ message: `Need a value for ${field}` });
  //   }
  //});
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

app.put('/api/:id', authenticate, (req, res) => {
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
      console.log('results', results);
      res.status(204).send('sent successfully');
    })
    .catch(err => {
      console.log(err);
      res.status(500).send({ message: 'Error from Put' });
    });
});

app.delete('/api/users/:id', authenticate, (req, res) => {
  User
    .findByIdAndRemove(req.params.id)
    .then(result => {
      console.log(result);
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
