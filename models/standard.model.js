const sql = require("./db.js");
const schedule = require("./schedule.model.js");

// constructor
const Standard = function(standard) {
    this.idUser = standard.idUser
    this.email = standard.email;
    this.name = standard.name;
    this.surname = standard.surname;
    this.password = standard.password;
};

Standard.getProfile = (_idUser, result) => {
    sql.query("select idUser, Surname, Name, Mail from user where idUser=?",_idUser, (err, res) => {
        if (err) {
            console.log("error: ", err);
            result(err, null);
            return;
        }
        result(null, res);
    });
};

Standard.resetPassword = (user, result) => {
    sql.query("update user set Password=? where idUser=?", [user.password, user.idUser], (err, res) => {
        if (err) {
            console.log("error: ", err);
            result(err, null);
            return;
        }
        result(null, res);
    });
};

Standard.modifyProfile = (user, result) => {
    sql.query("update user set Surname=?, Name=?, Mail=? where idUser=?",[user.surname, user.name, user.email, user.idUser], (err, res) => {
        if (err) {
            console.log("error: ", err);
            result(err, null);
            return;
        }
        result(null, res);
    });
};

Standard.createPatient = (newPatient, result) => {
    sql.query("insert into patient(Surname, Name, idAlexa, iduser) values(?,?,?,?)",
        [newPatient.surname,newPatient.name,newPatient.idAlexa, newPatient.iduser], (err, res) => {
            if (err) {
                console.log("error: ", err);
                result(err, null);
                return;
            }
            result(null, {...newPatient });
        });
};

Standard.findAllPatient = (_iduser, result) => {
    sql.query("select idpatient, Surname, Name, idAlexa from patient where iduser=?", _iduser, (err, res) => {
        if (err) {
            console.log("error: ", err);
            result(err, null);
            return;
        }
        result(null, res);
    });
};

Standard.findPatientById = (_idpatient, result) => {
    sql.query("select * from patient where idpatient=?",_idpatient, (err, res) => {
        if (err) {
            console.log("error: ", err);
            result(err, null);
            return;
        }
        result(null, res);
    });
};

Standard.deletePatientById = (_idpatient, result) => {
    Standard.deletePatientCrons(_idpatient);
    sql.query("delete from patient where idpatient=?",_idpatient, (err, res) => {
        if (err) {
            console.log("error: ", err);
            result(err, null);
            return;
        }
        result(null, res);
    });
};

Standard.deletePatientCrons = (_idPatient) => {
    sql.query("select idAlarm from calendar where idPatient=?", _idPatient, (err,res) => {
        if (err) {
            console.log("error: ", err);
            return;
        }
        for (var i = 0; i < res.length; i++){
            schedule.removeCron(res[i].idAlarm);
        }
    });
}

Standard.modifyPatient = (patient, result) => {
    sql.query("update patient set Surname=?, Name=?, idAlexa=? where idpatient=?",
        [patient.surname,patient.name, patient.idAlexa, patient.idpatient], (err, res) => {
            if (err) {
                console.log("error: ", err);
                result(err, null);
                return;
            }
            result(null, res);
    });
};

Standard.checkSelfMail = (user, result) => {
    //console.log(user);
    sql.query("select * from user where Mail=? and Mail in (select Mail from user where idUser not in (select idUser from user where idUser=?))",
        [user.email, user.idUser], (err, res) => {
            if (err) {
                console.log("error: ", err);
                result(err, null);
                return;
            }
            result(null, res);
        });
}

module.exports = Standard;
