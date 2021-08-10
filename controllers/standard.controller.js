const Patient = require("../models/patient.model");
const Standard = require("../models/standard.model");
var bcrypt = require("bcryptjs");
var jwt = require("jsonwebtoken");
const config = require("../config/auth.config.js");

exports.getProfile = (req, res) => {
    const token = req.cookies.access_token;
    const data = jwt.verify(token, config.secret);

    Standard.getProfile(data.id, (err, data) => {
        if (err)
            res.status(500).send({
                message:
                    err.message || "Some error occurred while creating the New Patient."
            });
        else res.send(data);
    });
};

exports.modifyProfile = (req, res) => {
    const token = req.cookies.access_token;
    const data = jwt.verify(token, config.secret);

    const user = new Standard({
        idUser: data.id,
        email: req.body.email,
        name: req.body.name,
        surname: req.body.surname,
    });
    Standard.modifyProfile(user, (err, data) => {
        if (err)
            res.status(500).send({
                message:
                    err.message || "Some error occurred while creating the New Patient."
            });
        else res.redirect("/standard");
    });
};

exports.resetSelfPassword = (req, res) => {
    const token = req.cookies.access_token;
    const data = jwt.verify(token, config.secret);
    let hash = bcrypt.hashSync(req.body.password, 8);
    Standard.resetPassword({idUser: data.id, password: hash}, (err, data) => {
        if (err)
            res.status(500).send({
                message:
                    err.message || "Some error occurred while find the User."
            });
        else res.redirect("/standard");
    });
};

exports.createPatient = (req, res) => {
    // Validate request
    if (!req.body) {
        res.status(400).send({
            message: "Content can not be empty!"
        });
    }
    const token = req.cookies.access_token;
    const data = jwt.verify(token, config.secret);
    const patient = new Patient({
        name: req.body.name,
        surname: req.body.surname,
        idAlexa: req.body.idAlexa,
        iduser: data.id,
    });
    Standard.createPatient(patient, (err, data) => {
        if (err)
            res.status(500).send({
                message:
                    err.message || "Some error occurred while creating the New Patient."
            });
        else res.redirect("/standard");
    });
};

exports.findAllPatient = (req, res) => {
    const token = req.cookies.access_token;
    const data = jwt.verify(token, config.secret);
    Standard.findAllPatient( data.id, (err, data) => {
        if (err)
            res.status(500).send({
                message:
                    err.message || "Some error occurred while find Patient."
            });
        else res.send(data);
    });
};

exports.findPatientById = (req, res) => {
    Standard.findPatientById(req.params.idpatient, (err, data) => {
        if (err)
            res.status(500).send({
                message:
                    err.message || "Some error occurred while find the Patient."
            });
        else res.send(data);
    });
};

exports.deletePatientById = (req, res) => {
    Standard.deletePatientById(req.params.idpatient, (err, data) => {
        if (err)
            res.status(500).send({
                message:
                    err.message || "Some error occurred while find the Patient."
            });
        else res.send(data);
    });
};

exports.modifyPatient = (req, res) => {
    const patient = new Patient({
        idpatient: req.params.idpatient,
        idAlexa: req.body.idAlexa,
        name: req.body.name,
        surname: req.body.surname,
    });
    Standard.modifyPatient(patient, (err, data) => {
        if (err)
            res.status(500).send({
                message:
                    err.message || "Some error occurred while find the User."
            });
        else res.redirect("/standard");
    });
};