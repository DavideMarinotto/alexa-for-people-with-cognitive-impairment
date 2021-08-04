const sql = require("./db.js");

// constructor
const Standard = function(standard) {
    this.idUser = standard.idUser
    this.email = standard.email;
    this.name = standard.name;
    this.surname = standard.surname;
};

module.exports = Standard;
