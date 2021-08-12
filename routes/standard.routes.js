var express = require('express');
var router = express.Router();
var path = require('path');
const authJwt = require("../models/authJwt.model");
const standard = require("../controllers/standard.controller");
const { body } = require('express-validator');


router.use(function(req, res, next) {
  res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
  );
  next();
});

router.get('/', function(req, res, next) {
  res.sendFile(path.resolve('public/standard.html'));
});
router.get('/profile',[authJwt.isStandard],standard.getProfile);
router.post('/profile',
    [
    body('name').isLength({ min: 5 }),
    authJwt.isStandard
        ],
    standard.modifyProfile);
router.post('/resetPassword',
    [
    body('password').isLength({ min: 5 }),
    authJwt.isStandard
        ],
    standard.resetSelfPassword);
router.post('/patients',[authJwt.isStandard],standard.createPatient);
router.get('/patients',[authJwt.isStandard],standard.findAllPatient);
router.get('/patient/:idpatient',[authJwt.isStandard],standard.findPatientById);
router.delete('/patient/:idpatient',[authJwt.isStandard],standard.deletePatientById);
router.post('/patient/:idpatient',
    [
    body('name').trim().escape().not().isEmpty(),
    body('surname').trim().escape().not().isEmpty(),
    body('idAlexa').trim().escape().not().isEmpty(),
    authJwt.isStandard
    ],
    standard.modifyPatient);
router.get('/export',[authJwt.isStandard],standard.exportToCSW);

module.exports = router;
