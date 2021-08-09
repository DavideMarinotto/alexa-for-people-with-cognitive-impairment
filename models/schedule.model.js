const sql = require("./db.js");
const schedule = require('node-schedule');

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
        sql.query("SELECT C.idAlarm, P.idAlexa FROM proginginf.calendar C, proginginf.patient P WHERE P.idpatient=C.idPatient AND idAlarm=(SELECT max(idAlarm) FROM proginginf.calendar)",(err, res) => {
            if (err) {
                console.log("error: ", err);
                result(err, null);
                return;
            }
            Schedule.addCron(res[0].idAlarm.toString(),newAlarm.message,res[0].idAlexa,newAlarm.cron);
            result(null, {...newAlarm });
        });
    });
};

Schedule.findAllPatientAlarms = (_idPatient, result) => {
    sql.query("select message, cron, cronString, idAlarm from proginginf.calendar where idPatient=?", _idPatient,(err, res) => {
            if (err) {
                console.log("error: ", err);
                result(err, null);
                return;
            }
            result(null, res);
        });
};
Schedule.findAllAlarms = result => {
    sql.query("select C.message, C.cron, C.cronString, C.idAlarm, P.idAlexa from proginginf.calendar C, proginginf.patient P WHERE C.idPatient=P.idpatient", (err, res) => {
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
    Schedule.removeCron(_idAlarm);
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
            sql.query("SELECT C.idPatient, P.idAlexa FROM proginginf.calendar C, proginginf.patient P WHERE C.idPatient=P.idpatient AND idAlarm=?", alarm.idAlarm, (err, secondRes) => {
                if (err) {
                    console.log("error: ", err);
                    result(err, null);
                    return;
                }
                Schedule.removeCron(alarm.idAlarm);
                Schedule.addCron(alarm.idAlarm,alarm.message,secondRes[0].idAlexa,alarm.cron);
                result(null, secondRes);
            });
        });
};

Schedule.addCron = (_uniqueName,_message,_to,_at) =>{
    const job = schedule.scheduleJob(_uniqueName,_at,function(){
        console.log('Send to '+_to+ " "+_message);
    });
}

Schedule.removeCron = (_id) =>{
        let current_job = schedule.scheduledJobs[_id];
        if (current_job){
            current_job.cancel();
        }
}

module.exports = Schedule;