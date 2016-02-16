var express = require('express');
var router = express.Router();

var User = require('../models/user');



/* GET users listing. */
router.post('/register', function(req, res, next) {
  // req.body === {username:___,password:____}
  User.register(req.body, function(err, savedUser){
    res.status(err ? 400 : 200).send(err|| user);

  })
});

module.exports = router;
