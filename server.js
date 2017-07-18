//Heroku link: https://floating-scrubland-74394.herokuapp.com/

const bodyParser = require('body-parser');
const express = require('express');
const mongoose = require('mongoose');

const passport = require('passport')
const {BasicStrategy} = require('passport-http')
const bcrypt = require('bcrypt')

mongoose.Promise = global.Promise;
const {PORT, DATABASE_URL} = require('./config');
const {USER} = require('./models');

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static('public'));

const basicStrategy = new BasicStrategy(function (username, password, done) {
  let user;
  USER
    .findOne({username: username})
    
    .then(_user => {
      user = _user;
      if (!user) {
        return done(null, false, {message: 'Incorrect username'});
      }
      console.log(password, user.password, password === user.password)
      return password === user.password;
    })
    .then(isValid => {
      if (!isValid) {
        return done(null, false, {message: 'Incorrect password'});
      }
      else {
        return done(null, user);
      }
    });
});

passport.use(basicStrategy);
const authenticate = passport.authenticate('basic', {session: false});

//Endpoints

app.get('/api/users', (req, res) => {
  console.log('get is happening');
  USER
    .find()
    .then(users => {
      console.log(users);
      res.status(200).json(users);
    })
    .catch(err => {
      console.log('testing');
      res.status(500).json({message: 'Internal error from GET'});
    });
});


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

app.get('/api/users/:id/list', (req, res) => {
  console.log('get by id is happening');
  USER
    .findById(req.params.id)
    .then(user => {
      console.log(user);
      res.status(200).json(user.myList);
    })
    .catch(err => {
      console.log('testing');
      res.status(500).json({message: 'Internal error from GET'});
    });
});

app.post('/api', authenticate, (req, res) => {
  console.log('post is happening');
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
      email: req.body.email,
      myList: req.body.myList
    })
    .then(
      results => {
        console.log(results);
        res.status(201).json(results.apiRepr());
      })
    .catch(err => {
      console.log('Post isn\'t working');
      res.status(500).json({message: 'Internal error from Post'});
    });
});

app.put('/api/:id', authenticate, (req, res) => {
  USER
    .findByIdAndUpdate(req.params.id), 
  {
    //will be a set. have to delete the older version of the item
    $push: {myList: {
      name: req.body.name, 
      date: req.body.date, 
      rating:req.body.rating
    }
    }
  }
    .then(results => {
      console.log(results);
      res.status(204);
    })
    .catch(err => {
      console.log(err);
      res.status(500).send({message: 'Error from Put'});
    });
});

app.delete('/api/:id', authenticate, (req, res) => {
  USER
    .findByIdAndRemove(req.params.id)
    .then(result => {
      console.log(result);
      res.status(204).send({message: 'Deleted'});
    })
    .catch(err => {
      console.log(err);
      res.status(500).send({message: 'Error from Delete'});
    });
});





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
}

module.exports = {app, runServer, closeServer};

// app.listen(process.env.PORT || 8080, () => {
//   console.log(`Your app is listening on port ${process.env.PORT || 8080}`);
// });