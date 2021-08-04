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

        console.log("created user: ", {...newUser });
        result(null, {...newUser });
    });
};

Admin.findAllUsers = result => {
    sql.query("select * from proginginf.user", (err, res) => {
            if (err) {
                console.log("error: ", err);
                result(err, null);
                return;
            }
            console.log("found users: ", res);
            result(null, res);
        });
};

module.exports = Admin;