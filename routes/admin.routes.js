var express = require('express');
var router = express.Router();
var path = require('path');
const { body } = require('express-validator');


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
router.get('/profile',[authJwt.isAdmin],admin.getProfile);
router.post('/profile',
    [
        body('email').isEmail(),
        body('surname').trim().escape().not().isEmpty(),
        body('name').trim().escape().not().isEmpty(),
        authJwt.isAdmin
    ],
    admin.modifyProfile);
router.get('/standard-login/:idUser',[authJwt.isAdmin],admin.loginAsStandard);
router.post('/createNewUser',[authJwt.isAdmin],admin.createUser);
router.get('/list',[authJwt.isAdmin],admin.findAllUsers);
router.get('/user/:idUser',[authJwt.isAdmin],admin.findUserById);
router.delete('/user/:idUser',[authJwt.isAdmin],admin.deleteUserById);
router.post('/user/:idUser/reset',
    [
        body('password').isLength({ min: 5 }),
        authJwt.isAdmin
    ],
    admin.resetPassword);
router.post('/user/:idUser/modify',
    [
        body('email').isEmail(),
        body('surname').trim().escape().not().isEmpty(),
        body('name').trim().escape().not().isEmpty(),
        authJwt.isAdmin
    ],
    admin.modifyUser
);
router.post('/resetPassword',
    [
        body('password').isLength({ min: 5 }),
        authJwt.isAdmin
    ],
    admin.resetSelfPassword);
router.get('/export',[authJwt.isAdmin],admin.exportToCSW);

module.exports = router;
