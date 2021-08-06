// constructor
const Patient = function(patient) {
    this.idpatient = patient.idpatient
    this.iduser = patient.iduser;
    this.name = patient.name;
    this.surname = patient.surname;
    this.idAlexa = patient.idAlexa;
};

module.exports = Patient;
