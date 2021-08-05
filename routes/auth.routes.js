var express = require('express');
var router = express.Router();
const controller = require("../controllers/authJwt.controller");

router.use(function(req, res, next) {
        res.header(
            "Access-Control-Allow-Headers",
            "x-access-token, Origin, Content-Type, Accept"
        );
        next();
    });

router.post("/signin", controller.signin);
router.get("/logout", (req, res) => {
    return res
        .clearCookie("access_token")
        .redirect("/");
});

module.exports = router;
