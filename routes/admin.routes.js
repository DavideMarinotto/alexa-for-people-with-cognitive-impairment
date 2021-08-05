var express = require('express');
var router = express.Router();
var path = require('path');

var authJwt = require("../models/authJwt.model");
var admin = require("../controllers/admin.controller");

router.use(function(req, res, next) {
  res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
  );
  next();
});

router.get('/', [authJwt.isAdmin],function(req, res, next) {
  res.sendFile(path.resolve('public/admin.html'));
});
router.post('/createNewUser',admin.createUser);
router.get('/list',admin.findAllUsers);
router.get('/user/:idUser',admin.findUserById);
router.delete('/user/:idUser',admin.deleteUserById);

module.exports = router;
