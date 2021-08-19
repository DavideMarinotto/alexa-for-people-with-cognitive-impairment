const Admin = require("../models/admin.model");
const Standard = require("../models/standard.model");
var bcrypt = require("bcryptjs");
var jwt = require("jsonwebtoken");
const config = require("../config/auth.config.js");
const {Parser} = require('json2csv');
const {validationResult} = require('express-validator');


exports.getProfile = (req, res) => {
    const token = req.cookies.access_token;
    const data = jwt.verify(token, config.secret);

    Admin.getProfile(data.id, (err, data) => {
        if (err)
            res.status(500).send({
                message:
                    err.message || "Some error occurred while creating the New Patient."
            });
        else res.send(data);
    });
};

exports.modifyProfile = (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    const token = req.cookies.access_token;
    const data = jwt.verify(token, config.secret);

    const user = new Standard({
        idUser: data.id,
        email: req.body.email,
        name: req.body.name,
        surname: req.body.surname,
    });
    Admin.checkSelfMail(user, (err, data) => {
        if (err)
            res.status(500).send({
                message:
                    err.message || "Some error occurred while creating the New User."
            });

        else if (data.length !== 0){
            res.status(403).send({ message: "Mail already taken." });
        }
        else {
            Admin.modifyProfile(user, (err, data) => {
                if (err)
                    res.status(500).send({
                        message:
                            err.message || "Some error occurred while editing your profile."
                    });
                else res.redirect("/admin");
            });
        }
    });
};

exports.resetSelfPassword = (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    const token = req.cookies.access_token;
    const data = jwt.verify(token, config.secret);
    let hash = bcrypt.hashSync(req.body.password, 8);
    Admin.resetPassword({idUser: data.id, password: hash}, (err, data) => {
        if (err)
            res.status(500).send({
                message:
                    err.message || "Some error occurred while resetting your password."
            });
        else res.redirect("/admin");
    });
};

exports.createUser = (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    let hash = bcrypt.hashSync(req.body.password, 8);
    Admin.checkUniqueMail(req.body.email, (err, data) => {
        if (err)
            res.status(500).send({
                message:
                    err.message || "Some error occurred while creating the New User."
            });

        else if (data.length !== 0){
            res.status(403).send({ message: "Mail already exist." });
        }
        else {
            const user = new Standard({
                email: req.body.email,
                name: req.body.name,
                surname: req.body.surname,
            });
            user.password = hash;
            Admin.createUser(user, (err, data) => {
                if (err)
                    res.status(500).send({ message:
                            err.message || "Some error occurred while creating the New User."
                    });
                else res.redirect("/admin");
            });
        }
    });
};

exports.findAllUsers = (req, res) => {
    Admin.findAllUsers( (err, data) => {
        if (err)
            res.status(500).send({
                message:
                    err.message || "Some error occurred while finding all the Users."
            });
        else res.send(data);
    });
};

// Create and Save a new Customer
exports.findUserById = (req, res) => {
    Admin.findUserById(req.params.idUser, (err, data) => {
        if (err)
            res.status(500).send({
                message:
                    err.message || "Some error occurred while finding the User."
            });
        else res.send(data);
    });
};

exports.deleteUserById = (req, res) => {
    Admin.deleteUserById(req.params.idUser, (err, data) => {
        if (err)
            res.status(500).send({
                message:
                    err.message || "Some error occurred while deleting the User."
            });
        else res.send(data);
    });
};

exports.resetPassword = (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    let hash = bcrypt.hashSync(req.body.password, 8);
    Admin.resetPassword({idUser: req.params.idUser, password: hash}, (err, data) => {
        if (err)
            res.status(500).send({
                message:
                    err.message || "Some error occurred while resetting the User's password."
            });
        else res.redirect("/admin");
    });
};

exports.modifyUser = (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    const user = new Standard({
        idUser: req.params.idUser,
        email: req.body.email,
        name: req.body.name,
        surname: req.body.surname,
    });
    Admin.checkSelfMail(user, (err, data) => {
        if (err)
            res.status(500).send({
                message:
                    err.message || "Some error occurred while creating the New User."
            });

        else if (data.length !== 0) {
            res.status(403).send({message: "Mail already exist."});
        } else {
            Admin.modifyUser(user, (err, data) => {
                if (err)
                    res.status(500).send({
                        message:
                            err.message || "Some error occurred while editing the User's infos."
                    });
                else res.redirect("/admin");
            });
        }
    });
};

exports.loginAsStandard = (req, res) => {
    var token = jwt.sign({id: req.params.idUser, role: "standard"}, config.secret);
    res.cookie("access_token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
        }).status(200).send("/standard");
};

exports.getTime = (req, res) =>{
    let date_ob = new Date();
    // current hours
    let hours = date_ob.getHours();
    // current minutes
    let minutes = date_ob.getMinutes();
    let data = {
        "hours": hours,
        "minutes":minutes
    };
    res.status(200).json(data);
};

exports.exportToCSW = (req, res) => {
    /*const token = req.cookies.access_token;
    const user = jwt.verify(token, config.secret);*/
    const fields = ['idUser', 'Surname', 'Name', 'Mail'];
    const opts = {fields};

    Admin.findAllUsers( (db_err, data) => {
        if (db_err)
            res.status(500).send({
                message:
                    err.message || "Some error occurred while exporting to CSW."
            });
        else {
            const parser = new Parser(opts);
            const csv = parser.parse(data);
            var filename = 'StandardUsers';
            res.set('Content-Disposition', ["attachment; filename=", filename, '.csv'].join(''));
            res.end(csv);
        }
    });
};