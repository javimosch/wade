const console = require('tracer').colorConsole({
  dateformat: "HH:MM:ss.l"
});
import mongoose from 'mongoose';
const ACCESS_KEY = process.env.ACCESS_KEY;
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
import * as admin from "firebase-admin";
var CryptoJS = require("crypto-js");
var bcrypt = require('bcrypt');


function bcryptEncode(text) {
  return new Promise((resolve, reject) => {
    bcrypt.genSalt(10, function(err, salt) {
      bcrypt.hash(text, salt, function(err, hash) {
        resolve(hash);
      });
    });
  })
}

function bcryptCompare(text, hash) {
  return new Promise((resolve, reject) => {
    bcrypt.compare(text, hash, function(err, res) {
      resolve(res);
    });
  });
}




module.exports = {
  bcryptEncode: bcryptEncode,
  bcryptCompare: bcryptCompare,
  ensureLoggedIn: () => require('connect-ensure-login').ensureLoggedIn(),
  authenticate: createLocalStrategyOnce(),
  parseUserFromToken: parseUserFromToken,
  parseUserFromSession: parseUserFromSession,
  authenticateUser: authenticateUser,
  isLoggedIn: function(req, res, next) {

    // if user is authenticated in the session, carry on 
    if (req.isAuthenticated())
      return next();

    // if they aren't redirect them to the home page
    res.status(401).send();
  },
  ensureAuthenticated: function(req, res, next) {

    let accessKeyValidated = false;

    const User = mongoose.model('user');

    if (req.query.accessKey && ACCESS_KEY && req.query.accessKey.toString().toUpperCase() == ACCESS_KEY.toString().toUpperCase()) {
      accessKeyValidated = true;
      //By pass for postman
      if (!req.user) {
        return User.findOne(req.query.session_id && {
          _id: req.query.session_id
        } || {}).then(user => {
          req.user = user;
          console.log('Using access key (random/set user ' + user.email + ')', req.url);
          validate();
        }).catch(_err => {
          console.log('Using access key (random user fail)', req.url);
          validate();
        });
      }
      else {
        console.log('Using access key (there is a session)', req.url);
      }
    }
    else {
      if (req.query.accessKey) {
        console.log('Access key mistmach', req.query.accessKey, ACCESS_KEY);
      }
    }

    validate();

    function validate() {
      if (accessKeyValidated || req.isAuthenticated()) {
        // Update Last connexion
        if (req.user) {
          User.update({
              "_id": req.user._id
            }, {
              "$set": {
                last_connexion: Date.now()
              }
            },
            function(err, data) {
              if (err) {
                console.error(err);
              }
              next();
            }
          );
        }
        else {
          next();
        }
      }
      else {
        console.error('ensureAuthenticated rejected url ', req.url);
        res.redirect('/unauthorized');
      }
    }
  }
};


let userToken = {};
async function parseUserFromToken(token) {
  if (userToken[token]) return userToken[token];
  console.log('parseUserFromToken',token.length);
  let decodedToken = await admin.auth().verifyIdToken(token);
  var uid = decodedToken.uid;
  let userRecord = await admin.auth().getUser(uid);
  userRecord = userRecord.toJSON();
  let user = await mongoose.model('user').findOne({
    email: userRecord.email
  }).exec();
  if (!user) {
    throw new Error('Invalid user email ' + userRecord.email);
  }
  userToken[token] = user;
  return user;
}

function parseUserFromSession() {
  return function(req, res, next) {
    (async() => {
      
      let session = req.session;
      let token = session && session.refreshToken;
      let user_id = session && session.user_id;

      if (user_id) {
        let user = await mongoose.model('user').findById(user_id);
        if (!user) {
          throw new Error('Invalid user_id ' + user_id);
        }
        req.user = user;
        console.log('user parsed from session (user_id)');
        next();
      }
      else {
        if (token) {
          let user = await parseUserFromToken(token);
          req.user = user;
          console.log('user parsed from session (token)');
          next();
        }
        else {
          
          console.log('no user was parsed',session);
          next();
        }
      }


    })().catch(err => {
      console.log('unable to parse user', err);
      next();
    });
  };
}

function authenticateUser() {
  return function(req, res, next) {
    let email = req.body.email;
    let pwd = req.body.password;
    authenticateAgainstDaTabase(email, pwd, (err, user) => {
      if (!err && user) {
        next();
      }
      else {
        if (err) console.error(err);
        req.status(401).send();
      }
    });
  };
}


function authenticateAgainstDaTabase(username, password, done) {
  let User = mongoose.model('user');
  User.findOne({ archived: { $ne: true }, email: username }, function(err, user) {
    if (err) {
      return done(err, null);
    }
    else if (user == null || user.length == 0) {
      return done(null, false);
    }
    else {
      bcryptCompare(password, user.password).then(equal => {
        console.log('LOGIN', password, equal);
        if (equal) {
          console.log('LOGGED', user);
          return done(null, user);
        }
        else {
          return done(null, false);
        }
      })
    }
  });
}


function createLocalStrategyOnce() {
  passport.use('local', new LocalStrategy({
      usernameField: 'email',
      passwordField: 'password',
      //session: false
    },
    authenticateAgainstDaTabase
  ));
  return function() {
    return passport.authenticate('local', { session: true });
  };
}
