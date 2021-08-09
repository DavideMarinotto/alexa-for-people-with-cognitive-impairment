const config = require("../config/auth.config");
var User = require("../models/user.model")
var jwt = require("jsonwebtoken");
var bcrypt = require("bcryptjs");

exports.signin = (req, res) => {
    var user;
    User.findUserByMail(req.body.mail, (err, data) => {
        if (err)
            res.status(500).send({
                message:
                    err.message || "Some error occurred while find Users."
            });
        if (!data) {
            return res.redirect("/");
        }
        user = new User(data);
        var passwordIsValid = bcrypt.compareSync(
            req.body.password,
            user.Password
        );
        if (!passwordIsValid) {
            return res.redirect("/");
        }
        var role = "standard";
        if (user.isAdmin){
            role = "admin"
        }
        var path = '/'+role;
        var token = jwt.sign({id: user.idUser, role: role}, config.secret);

        return res
            .cookie("access_token", token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
            })
            .redirect(path);
    });
};