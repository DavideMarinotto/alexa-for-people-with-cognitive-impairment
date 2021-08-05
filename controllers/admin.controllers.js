const Admin = require("../models/admin.model");
const Standard = require("../models/admin.model");

// Create and Save a new Customer
exports.createUser = (req, res) => {
    // Validate request
    if (!req.body) {
        res.status(400).send({
            message: "Content can not be empty!"
        });
    }

    // Constructor
    const user = new Standard({
        email: req.body.email,
        name: req.body.name,
        surname: req.body.surname,
        password: req.body.password
    });

    Admin.createUser(user, (err, data) => {
        if (err)
            res.status(500).send({
                message:
                    err.message || "Some error occurred while creating the New User."
            });
        else res.send(data);
    });
};

// Create and Save a new Customer
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
    console.log(req.params.idUser);
    Admin.findUserById(req.params.idUser, (err, data) => {
        if (err)
            res.status(500).send({
                message:
                    err.message || "Some error occurred while find the User."
            });
        else res.send(data);
    });
};

// Create and Save a new Customer
exports.deleteUserById = (req, res) => {
    console.log(req.params.idUser);
    Admin.deleteUserById(req.params.idUser, (err, data) => {
        if (err)
            res.status(500).send({
                message:
                    err.message || "Some error occurred while find the User."
            });
        else res.send(data);
    });
};