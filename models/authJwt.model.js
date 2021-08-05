const jwt = require("jsonwebtoken");
const config = require("../config/auth.config.js");

isVerify = (req, res, next) => {
    const token = req.cookies.access_token;

    if (!token) {
        return res.status(403).send({
            message: "No token provided!"
        });
    }
    try {
        const data = jwt.verify(token, config.secret);
        console.log(data);
        req.userId = data. id;
        req.userRole = data.role;
        return next();
    } catch {
        return res.sendStatus(403);
    }
};

isAdmin = (req, res, next) => {
    const token = req.cookies.access_token;

    if (!token) {
        return res.status(403).send({
            message: "No token provided!"
        });
    }
    try {
        const data = jwt.verify(token, config.secret);
        console.log(data);
        req.userId = data. id;
        req.userRole = data.role;
        if (data.role !== "admin")
            return res.status(401).send({
                message: "Unauthorized!"
            });
        return next();
    } catch {
        return res.sendStatus(403);
    }
};

isStandard = (req, res, next) => {
    const token = req.cookies.access_token;

    if (!token) {
        return res.status(403).send({
            message: "No token provided!"
        });
    }
    try {
        const data = jwt.verify(token, config.secret);
        console.log(data);
        req.userId = data. id;
        req.userRole = data.role;
        if (data.role !== "standard")
            return res.status(401).send({
                message: "Unauthorized!"
            });
        return next();
    } catch {
        return res.sendStatus(403);
    }
};

const authJwt = {
    isVerify: isVerify,
    isAdmin: isAdmin,
    isStandard: isStandard,
};
module.exports = authJwt;