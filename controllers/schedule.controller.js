const Schedule = require("../models/schedule.model");
const { validationResult } = require('express-validator');
const {Parser} = require('json2csv');

exports.createAlarm = (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    console.log(req.body.message);
    const alarm = new Schedule({
        idPatient: req.body.idPatient,
        message: req.body.message,
        cron: req.body.cron,
        cronString: req.body.cronString,
    });
    Schedule.createAlarm(alarm, (err, data) => {
        if (err)
            res.status(500).send({
                message:
                    err.message || "Some error occurred while creating the New Alarm."
            });
        else res.send(data);
    });
};

exports.findAllPatientAlarms = (req, res) => {
    Schedule.findAllPatientAlarms( req.params.idPatient, (err, data) => {
        if (err)
            res.status(500).send({
                message:
                    err.message || "Some error occurred while finding all the patient's alarms."
            });
        else res.send(data);
    });
};

exports.findAlarmById = (req, res) => {
    Schedule.findAlarmById(req.params.idAlarm, (err, data) => {
        if (err)
            res.status(500).send({
                message:
                    err.message || "Some error occurred while finding the Alarm."
            });
        else res.send(data);
    });
};

exports.deleteAlarmById = (req, res) => {
    Schedule.deleteAlarmById(req.params.idAlarm, (err, data) => {
        if (err)
            res.status(500).send({
                message:
                    err.message || "Some error occurred while deleting the Alarm."
            });
        else res.send(data);
    });
};

exports.modifyAlarm = (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    const alarm = new Schedule({
        idAlarm: req.params.idAlarm,
        message: req.body.message,
        cron: req.body.cron,
        cronString: req.body.cronString,
    });
    Schedule.modifyAlarm(alarm, (err, data) => {
        if (err)
            res.status(500).send({
                message:
                    err.message || "Some error occurred while editing the Alarm."
            });
        res.send(data);
    });
};

exports.exportToCSW = (req, res) => {
    const fields = ['idAlarm', 'message', 'cronString', 'idPatient', 'Surname', 'Name'];
    const opts = {fields};

    Schedule.findAllAlarms((db_err, data) => {
        if (db_err)
            res.status(500).send({
                message:
                    err.message || "Some error occurred while exporting to CSW."
            });
        else {
            const parser = new Parser(opts);
            const csv = parser.parse(data);
            var filename = 'Alarms';
            res.set('Content-Disposition', ["attachment; filename=", filename, '.csv'].join(''));
            res.end(csv);
        }
    });
};