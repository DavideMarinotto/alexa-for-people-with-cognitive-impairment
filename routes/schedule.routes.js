var express = require('express');
var router = express.Router();
var path = require('path');
const authJwt = require("../models/authJwt.model");
const schedule = require("../models/schedule.model");
router.get('/', [authJwt.isStandard],function(req, res, next) {
  res.sendFile(path.resolve('public/admin.html'));
});
router.post('/allarms',[authJwt.isStandard],schedule.createAlarm);
router.get('/allarms',[authJwt.isStandard],schedule.findAllUserAlarms);
router.get('/allarm/:idAllarm',[authJwt.isStandard],schedule.findAlarmById);
router.delete('/allarm/:idAllarm',[authJwt.isStandard],schedule.deleteAlarmById);
router.post('/allarm/:idAllarm',[authJwt.isStandard],schedule.modifyAlarm);

router.get('/test',schedule.test);



module.exports = router;
