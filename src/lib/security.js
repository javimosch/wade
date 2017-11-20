const console = require('tracer').colorConsole({
  dateformat: "HH:MM:ss.l"
});
import mongoose from 'mongoose';
const ACCESS_KEY = process.env.ACCESS_KEY;
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;

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
  isAuthenticated: isAuthenticated(),
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



function isAuthenticated() {
  passport.use('local', new LocalStrategy({
      usernameField: 'email',
      passwordField: 'password',
      //session: false
    },
    function(username, password, done) {
      // asynchronous verification, for effect...
      let User = mongoose.model('user');

      console.log('PASSAPORT LocalStrategy', username, password);

      User.findOne({ archived: { $ne: true }, email: username }, function(err, user) {
        if (err) {
          return done(err, null);
        }
        else if (user == null || user.length == 0) {
          return done(null, false);
        }
        else {
          
          bcryptCompare(password, user.password).then(equal => {
            console.log('LOGIN',password,equal);
            if (equal) {
              console.log('LOGGED',user);
              return done(null, user);
            }
            else {
              return done(null, false);
            }
          })


        }
      });
    }
  ));
  return passport.authenticate('local', {}); //failureRedirect: '/unauthorized'
}
