'use strict';

var mongoose = require('mongoose');
var bcrypt = require('bcrypt-node');

var User;

var userSchema = new mongoose.Schema({
 username: { type: String, required: true },
 // hash: { type: String, required: true }
 password: { type: String, required: true }
});

userSchema.pre('save', function(next) {
 // hash the password
 // this === object we're trying to save
 console.log('presave middleware:', this);

 if(!this.isNew) return next();  // ensures we only salt the hash for new users
 bcrypt.genSalt(12, (err, salt) => {
   bcrypt.hash(this.password, salt, null, (err, hash) => {
     // this.hash = hash;
     this.password = hash;
     next();
   });
 });
});

userSchema.statics.register = function(user, cb) {
 // user === {username: ___ , password: ____ }
 User.findOne({username: user.username}, function(err, dbUser) {
   if (err || dbUser) { return cb(err || 'Username already taken.')};

   User.create(user, function(err, savedUser) {
     // savedUser.hash = '';
     savedUser.password = '';
     cb(err, savedUser)
   });
 });
};

userSchema.statics.isAuthenticated = function(req, res, next) {
  if (!req.headers.authorization) {
    return res.status(401).send('Authentication required.');
  }
  var auth = req.headers.authorization.split(' ');
  if (auth[0] !== 'Bearer') {
    return res.status(401).send('Authentication required.');
  }
  var token = auth[1];
  try {
    var payload = jwt.decode(token, JWT_SECRET);
  } catch (err) {
    return res.status(401).send('Authentication failed.  Invalid token.');
  }
  if(moment().isAfter(moment.unix(payload.exp))) {
    return res.status(401).send('Authentication failed.  Token expired.');
  }
  var userId = payload._id;
  User.findById(userId, function (err, user) {
    if (err || !user) return res.status(401).send(err || 'Authentication failed.  User not found.');
    user.password = null;
    req.user = user;
    next();
  });
};
