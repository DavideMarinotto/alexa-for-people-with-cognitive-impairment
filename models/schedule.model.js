const sql = require("./db.js");
const schedule = require('node-schedule');
var https = require("https");
var alexaConfig = require("../config/alexa.config");

// constructor
const Schedule = function(schedule) {
    this.idAlarm = schedule.idAlarm
    this.idPatient = schedule.idPatient;
    this.message = schedule.message;
    this.cron = schedule.cron;
    this.cronString = schedule.cronString;
    this.alarmType = schedule.alarmType;
};

Schedule.createAlarm = (newAlarm, result) => {
    sql.query("insert into proginginf.calendar(message, cron, cronString, idPatient, alarmType) values(?,?,?,?,?)",
        [newAlarm.message,newAlarm.cron,newAlarm.cronString, newAlarm.idPatient, newAlarm.alarmType], (err, res) => {
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
            Schedule.addCron(res[0].idAlarm.toString(),newAlarm.message,res[0].idAlexa,newAlarm.cron,newAlarm.alarmType);
            result(null, {...newAlarm });
        });
    });
};

Schedule.findAllPatientAlarms = (_idPatient, result) => {
    sql.query("select message, cron, cronString, alarmType, idAlarm from proginginf.calendar where idPatient=?", _idPatient,(err, res) => {
            if (err) {
                console.log("error: ", err);
                result(err, null);
                return;
            }
            result(null, res);
        });
};
Schedule.findAllAlarms = result => {
    sql.query("select C.message, C.cron, C.cronString, C.idAlarm, C.alarmType, P.idAlexa, C.idPatient, P.Surname, P.Name from proginginf.calendar C, proginginf.patient P WHERE C.idPatient=P.idpatient", (err, res) => {
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
    sql.query("update proginginf.calendar set message=?, cron=?, cronString=?, alarmType=? where idAlarm=?",
        [alarm.message,alarm.cron,alarm.cronString,alarm.alarmType,alarm.idAlarm], (err, res) => {
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
                Schedule.addCron(alarm.idAlarm,alarm.message,secondRes[0].idAlexa,alarm.cron,alarm.alarmType);
                result(null, secondRes);
            });
        });
};
Schedule.callAlexa = (_message,_to,_type) =>{
    var notification = _message;
    if (_type === 'medical') notification = "Assicurati di " + _message;
    else if (_type === 'activities') notification = "Che ne dici di " + _message;
    else if (_type === 'reminder') notification = "Non dimenticarti di " + _message;
    //console.log(notification);
    var body = JSON.stringify({
        "notification": notification,
        "accessCode": _to
    });
    https.request({
        hostname: alexaConfig.hostname,
        path: alexaConfig.path,
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Content-Length": Buffer.byteLength(body)
        }
    }).end(body);

}
Schedule.addCron = (_uniqueName,_message,_to,_at,_type) =>{
    const job = schedule.scheduleJob(_uniqueName,_at,function(){
        //console.log('Send to '+_to+ " "+_message);
        Schedule.callAlexa(_message,_to,_type);
    });
}

Schedule.removeCron = (_id) =>{
        let current_job = schedule.scheduledJobs[_id];
        if (current_job){
            current_job.cancel();
        }
}

module.exports = Schedule;