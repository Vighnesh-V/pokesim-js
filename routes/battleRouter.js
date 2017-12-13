var express = require('express');
var router = express.Router();
var pDb = require('../db/player');
var authOrCreate = require('../middlewares/auth');

var renderNext = function (err, req, res, next) {
  res.render('battle', {
    user: req.query.key
  });
};


router.get('/battle', authOrCreate, renderNext);


module.exports = router;