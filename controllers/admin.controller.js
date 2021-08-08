const Admin = require("../models/admin.model");
const Standard = require("../models/standard.model");
var bcrypt = require("bcryptjs");
var jwt = require("jsonwebtoken");
const config = require("../config/auth.config.js");


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
    const token = req.cookies.access_token;
    const data = jwt.verify(token, config.secret);

    const user = new Standard({
        idUser: data.id,
        email: req.body.email,
        name: req.body.name,
        surname: req.body.surname,
    });
    Admin.modifyProfile(user, (err, data) => {
        if (err)
            res.status(500).send({
                message:
                    err.message || "Some error occurred while creating the New Patient."
            });
        else res.redirect("/admin");
    });
};

exports.createUser = (req, res) => {
    // Validate request
    if (!req.body) {
        res.status(400).send({
            message: "Content can not be empty!"
        });
    }
    let hash = bcrypt.hashSync(req.body.password, 8);
    const user = new Standard({
        email: req.body.email,
        name: req.body.name,
        surname: req.body.surname,
    });
    user.password = hash;
    Admin.createUser(user, (err, data) => {
        if (err)
            res.status(500).send({
                message:
                    err.message || "Some error occurred while creating the New User."
            });
        else res.redirect("/admin");
    });
};

exports.findAllUsers = (req, res) => {
    Admin.findAllUsers( (err, data) => {
        if (err)
            res.status(500).send({
                message:
                    err.message || "Some error occurred while find Users."
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
                    err.message || "Some error occurred while find the User."
            });
        else res.send(data);
    });
};

exports.deleteUserById = (req, res) => {
    Admin.deleteUserById(req.params.idUser, (err, data) => {
        if (err)
            res.status(500).send({
                message:
                    err.message || "Some error occurred while find the User."
            });
        else res.send(data);
    });
};

exports.resetPassword = (req, res) => {
    let hash = bcrypt.hashSync(req.body.password, 8);
    Admin.resetPassword({idUser: req.params.idUser, password: hash}, (err, data) => {
        if (err)
            res.status(500).send({
                message:
                    err.message || "Some error occurred while find the User."
            });
        else res.redirect("/admin");
    });
};

exports.modifyUser = (req, res) => {
    const user = new Standard({
        idUser: req.params.idUser,
        email: req.body.email,
        name: req.body.name,
        surname: req.body.surname,
    });
    Admin.modifyUser(user, (err, data) => {
        if (err)
            res.status(500).send({
                message:
                    err.message || "Some error occurred while find the User."
            });
        else res.redirect("/admin");
    });
};