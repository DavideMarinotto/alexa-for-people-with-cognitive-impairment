const sql = require("./db.js");

// constructor
const Standard = function(standard) {
    this.idUser = standard.idUser
    this.email = standard.email;
    this.name = standard.name;
    this.surname = standard.surname;
    this.password = standard.password;
};

Standard.createPatient = (newPatient, result) => {
    sql.query("insert into proginginf.patient(Surname, Name, idAlexa, iduser) values(?,?,?,?)",
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
    sql.query("select idpatient, Surname, Name, idAlexa from proginginf.patient where iduser=?", _iduser, (err, res) => {
        if (err) {
            console.log("error: ", err);
            result(err, null);
            return;
        }
        result(null, res);
    });
};

Standard.findPatientById = (_idpatient, result) => {
    sql.query("select * from proginginf.patient where idpatient=?",_idpatient, (err, res) => {
        if (err) {
            console.log("error: ", err);
            result(err, null);
            return;
        }
        result(null, res);
    });
};

Standard.deletePatientById = (_idpatient, result) => {
    sql.query("delete from proginginf.patient where idpatient=?",_idpatient, (err, res) => {
        if (err) {
            console.log("error: ", err);
            result(err, null);
            return;
        }
        result(null, res);
    });
};

Standard.modifyPatient = (patient, result) => {
    sql.query("update proginginf.patient set Surname=?, Name=?, idAlexa=? where idpatient=?",
        [patient.surname,patient.name, patient.idAlexa, patient.idpatient], (err, res) => {
            if (err) {
                console.log("error: ", err);
                result(err, null);
                return;
            }
            result(null, res);
    });
};

module.exports = Standard;
