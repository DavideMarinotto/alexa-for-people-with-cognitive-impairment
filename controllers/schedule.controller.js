const Schedule = require("../models/schedule.model");
const Standard = require("../models/admin.model");

exports.createAlarm = (req, res) => {
    // Validate request
    if (!req.body) {
        res.status(400).send({
            message: "Content can not be empty!"
        });
    }

    const alarm = new Schedule({
        idParent: req.body.idParent,
        message: req.body.message,
        cron: req.body.cron,
    });
    Schedule.createAlarm(alarm, (err, data) => {
        if (err)
            res.status(500).send({
                message:
                    err.message || "Some error occurred while creating the New User."
            });
        else res.redirect("/admin");
    });
};

exports.findAllUserAlarms = (req, res) => {
    Schedule.findAllUserAlarms( (err, data) => {
        if (err)
            res.status(500).send({
                message:
                    err.message || "Some error occurred while find Users."
            });
        else res.send(data);
    });
};

exports.findAlarmById = (req, res) => {
    Schedule.findAlarmById(req.params.idUser, (err, data) => {
        if (err)
            res.status(500).send({
                message:
                    err.message || "Some error occurred while find the User."
            });
        else res.send(data);
    });
};

exports.deleteAlarmById = (req, res) => {
    Schedule.deleteAlarmById(req.params.idAlarm, (err, data) => {
        if (err)
            res.status(500).send({
                message:
                    err.message || "Some error occurred while find the User."
            });
        else res.send(data);
    });
};

exports.modifyAlarm = (req, res) => {
    const alarm = new Schedule({
        idAlarm: req.body.idAlarm,
        idParent: req.body.idParent,
        message: req.body.message,
        cron: req.body.cron,
    });
    Schedule.modifyAlarm(alarm, (err, data) => {
        if (err)
            res.status(500).send({
                message:
                    err.message || "Some error occurred while find the User."
            });
        else res.redirect("/admin");
    });
};

exports.test = (req, res) => {
    Schedule.test();
};