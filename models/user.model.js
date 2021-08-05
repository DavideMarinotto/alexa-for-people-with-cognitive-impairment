const sql = require("./db.js");

// constructor
const User = function(user) {
    this.idUser = user.idUser
    this.Mail = user.Mail;
    this.Name = user.Name;
    this.Surname = user.Surname;
    this.Password = user.Password;
    this.isAdmin = user.isAdmin;
};

User.findUserByMail = (_mail, result) => {
    sql.query("select * from proginginf.user where mail=?",_mail, (err, res) => {
        if (err) {
            console.log("error: ", err);
            result(err, null);
            return;
        }
        result(null, new User(res[0]) );
    });
};

module.exports = User;
