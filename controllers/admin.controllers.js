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
        idUser: req.body.idUser,
        email: req.body.email,
        name: req.body.name,
        surname: req.body.surname
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
                    err.message || "Some error occurred while creating the New User."
            });
        else res.send(data);
    });
};