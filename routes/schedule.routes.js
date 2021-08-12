var express = require('express');
var router = express.Router();
var path = require('path');
const authJwt = require("../models/authJwt.model");
const schedule = require("../controllers/schedule.controller");
const { body } = require('express-validator');


router.use(function(req, res, next) {
    res.header(
        "Access-Control-Allow-Headers",
        "x-access-token, Origin, Content-Type, Accept"
    );
    next();
});

router.get('/', [authJwt.isStandard],function(req, res, next) {
  res.sendFile(path.resolve('public/admin.html'));
});
router.post('/alarms',
    body('message').trim().escape().not().isEmpty(),
    authJwt.isStandard,
    schedule.createAlarm
);
router.get('/alarms/:idPatient',[authJwt.isStandard],schedule.findAllPatientAlarms);
router.get('/alarm/:idAlarm',[authJwt.isStandard],schedule.findAlarmById);
router.delete('/alarm/:idAlarm',[authJwt.isStandard],schedule.deleteAlarmById);
router.post('/alarm/:idAlarm',
    body('message').trim().escape().not().isEmpty(),
    authJwt.isStandard,
    schedule.modifyAlarm
);
router.get('/export',[authJwt.isStandard],schedule.exportToCSW);

module.exports = router;
