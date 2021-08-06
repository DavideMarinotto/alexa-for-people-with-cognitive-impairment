const sql = require("./db.js");
var CronJob = require('cron').CronJob;

// constructor
const Schedule = function(schedule) {
    this.idAlarm = schedule.idAlarm
    this.idPatient = schedule.idPatient;
    this.message = schedule.message;
    this.cron = schedule.cron;
    this.cronString = schedule.cronString;
};

Schedule.createAlarm = (newAlarm, result) => {
    sql.query("insert into proginginf.calendar(message, cron, cronString, idPatient) values(?,?,?,?)",
        [newAlarm.message,newAlarm.cron,newAlarm.cronString, newAlarm.idPatient], (err, res) => {
        if (err) {
            console.log("error: ", err);
            result(err, null);
            return;
        }
        result(null, {...newAlarm });
    });
};

Schedule.findAllPatientAlarms = (_idPatient, result) => {
    sql.query("select message, cron, cronString from proginginf.calendar where idPatient=?",_idPatient, (err, res) => {
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