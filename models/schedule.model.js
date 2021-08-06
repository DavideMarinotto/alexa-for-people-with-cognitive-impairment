const sql = require("./db.js");
var CronJob = require('cron').CronJob;

// constructor
const Schedule = function(schedule) {
    this.idAlarm = schedule.idAlarm
    this.idParent = schedule.idParent;
    this.message = schedule.message;
    this.cron = schedule.cron;
    this.cronString = schedule.cronString;
};

Schedule.createAlarm = (newUser, result) => {
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

Schedule.findAllUserAlarms = result => {
    sql.query("select idUser, Surname, Name, Mail from proginginf.user where isAdmin=0", (err, res) => {
            if (err) {
                console.log("error: ", err);
                result(err, null);
                return;
            }
            result(null, res);
        });
};

Schedule.findAlarmById = (_idAlarm, result) => {
    sql.query("select * from proginginf.calendar where idAlarm=?",_idAlarm, (err, res) => {
        if (err) {
            console.log("error: ", err);
            result(err, null);
            return;
        }
        result(null, res);
    });
};

Schedule.deleteAlarmById = (_idAlarm, result) => {
    sql.query("delete from proginginf.calendar where idAlarm=?",_idAlarm, (err, res) => {
        if (err) {
            console.log("error: ", err);
            result(err, null);
            return;
        }
        result(null, res);
    });
};

Schedule.modifyAlarm = (alarm, result) => {
    sql.query("update proginginf.calendar set message=?, cron=?, cronString=? where idAlarm=?",
        [alarm.message,alarm.cron,alarm.cronString,alarm.idAlarm], (err, res) => {
            if (err) {
                console.log("error: ", err);
                result(err, null);
                return;
            }
            result(null, res);
        });
};


Schedule.test = () => {
    var job = new CronJob('* * * * * *', function() {
        console.log('You will see this message every second');
    }, null, true, 'America/Los_Angeles');
    job.start();
};

module.exports = Schedule;