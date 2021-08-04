const sql = require("./db.js");

// constructor
const Admin = function(admin) {
    this.idUser = admin.idUser
    this.email = admin.email;
    this.name = admin.name;
    this.surname = admin.surname;
};

Admin.createUser = (newUser, result) => {
    sql.query("insert into proginginf.user(idUser, Surname, Name, Mail) values(?,?,?,?)",
        [newUser.idUser,newUser.surname,newUser.name,newUser.email], (err, res) => {
        if (err) {
            console.log("error: ", err);
            result(err, null);
            return;
        }
        result(null, {...newUser });
    });
};

Admin.findAllUsers = result => {
    sql.query("select idUser, Surname, Name, Mail from proginginf.user where isAdmin=0", (err, res) => {
            if (err) {
                console.log("error: ", err);
                result(err, null);
                return;
            }
            result(null, res);
        });
};

module.exports = Admin;