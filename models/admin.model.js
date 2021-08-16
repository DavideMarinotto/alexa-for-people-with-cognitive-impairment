const sql = require("./db.js");
const schedule = require("./schedule.model.js");

// constructor
const Admin = function(admin) {
    this.idUser = admin.idUser
    this.email = admin.email;
    this.name = admin.name;
    this.surname = admin.surname;
};

Admin.getProfile = (_idUser, result) => {
    sql.query("select idUser, Surname, Name, Mail from proginginf.user where idUser=?",_idUser, (err, res) => {
        if (err) {
            console.log("error: ", err);
            result(err, null);
            return;
        }
        result(null, res);
    });
};

Admin.modifyProfile = (user, result) => {
    sql.query("update proginginf.user set Surname=?, Name=?, Mail=? where idUser=?",[user.surname, user.name, user.email, user.idUser], (err, res) => {
        if (err) {
            console.log("error: ", err);
            result(err, null);
            return;
        }
        result(null, res);
    });
};

Admin.createUser = (newUser, result) => {
    sql.query("insert into proginginf.user(Surname, Name, Mail, Password) values(?,?,?,?)",
        [newUser.surname,newUser.name,newUser.email, newUser.password], (err, res) => {
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

Admin.findUserById = (_idUser, result) => {
    sql.query("select * from proginginf.user where idUser=?",_idUser, (err, res) => {
        if (err) {
            console.log("error: ", err);
            result(err, null);
            return;
        }
        result(null, res);
    });
};

Admin.deleteUserById = (_idUser, result) => {
    sql.query("delete from proginginf.user where idUser=?",_idUser, (err, res) => {
        if (err) {
            console.log("error: ", err);
            result(err, null);
            return;
        }
        result(null, res);
    });
};

Admin.resetPassword = (user, result) => {
    sql.query("update proginginf.user set Password=? where idUser=?", [user.password, user.idUser], (err, res) => {
       if (err) {
           console.log("error: ", err);
           result(err, null);
           return;
       }
       result(null, res);
    });
};

Admin.modifyUser = (user, result) => {
    sql.query("update proginginf.user set Surname=?, Name=?, Mail=? where idUser=?",
        [user.surname,user.name,user.email, user.idUser], (err, res) => {
            if (err) {
                console.log("error: ", err);
                result(err, null);
                return;
            }
            result(null, res);
        });
};

Admin.checkUniqueMail = (_mail, result) => {
    sql.query("select * from proginginf.user where Mail=? and Mail in (select Mail from proginginf.user)",
        _mail, (err, res) => {
            if (err) {
                console.log("error: ", err);
                result(err, null);
                return;
            }
            result(null, res);
        });
};

Admin.checkSelfMail = (user, result) => {
    //console.log(user);
    sql.query("select * from proginginf.user where Mail=? and Mail in (select Mail from proginginf.user where idUser not in (select idUser from proginginf.user where idUser=?))",
        [user.email, user.idUser], (err, res) => {
            if (err) {
                console.log("error: ", err);
                result(err, null);
                return;
            }
            result(null, res);
        });
}

module.exports = Admin;