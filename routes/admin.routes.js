var express = require('express');
var router = express.Router();
var path = require('path');
var admin = require("../controllers/admin.controllers");

router.get('/', function(req, res, next) {
  res.sendFile(path.resolve('public/admin.html'));
});
router.post('/new',admin.createUser);
router.get('/list',admin.findAllUsers);

module.exports = router;
