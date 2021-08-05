const config = require("../config/auth.config");
var User = require("../models/user.model")
var jwt = require("jsonwebtoken");
var bcrypt = require("bcryptjs");

/*exports.signup = (req, res) => {
    // Save User to Database
    User.create({
        username: req.body.username,
        email: req.body.email,
        password: bcrypt.hashSync(req.body.password, 8)
    })
        .then(user => {
            if (req.body.roles) {
                Role.findAll({
                    where: {
                        name: {
                            [Op.or]: req.body.roles
                        }
                    }
                }).then(roles => {
                    user.setRoles(roles).then(() => {
                        res.send({ message: "User was registered successfully!" });
                    });
                });
            } else {
                // user role = 1
                user.setRoles([1]).then(() => {
                    res.send({ message: "User was registered successfully!" });
                });
            }
        })
        .catch(err => {
            res.status(500).send({ message: err.message });
        });
};*/

exports.signin = (req, res) => {
    var user;
    User.findUserByMail(req.body.mail, (err, data) => {
        if (err)
            res.status(500).send({
                message:
                    err.message || "Some error occurred while find Users."
            });

        user = data;
        if (!user) {
            return res.status(404).send({message: "User Not found."});
        }
        console.log(bcrypt.hashSync(req.body.password, 8));
        console.log(user.Password);

        var passwordIsValid = bcrypt.compareSync(
            req.body.password,
            user.Password
        );

        if (!passwordIsValid) {
            return res.status(401).send({
                accessToken: null,
                message: "Invalid Password!"
            });
        }
        var role = "standard";
        if (user.isAdmin){
            role = "admin"
        }
        var path = '/'+role;
        var token = jwt.sign({id: user.idUserd, role: role}, config.secret);

        return res
            .cookie("access_token", token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
            })
            .redirect(path);
    });
};