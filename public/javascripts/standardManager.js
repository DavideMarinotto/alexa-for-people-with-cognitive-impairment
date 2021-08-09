$(function(){
    let patientTable,
        addPatientModal,
        modifyPatientModal,
        alarmTable,
        addAlarmModal,
        modifyAlarmModal,
        myProfile,
        pageOrchestrator = new PageOrchestrator();

    $(function() {
        pageOrchestrator.start();
        patientTable.update();
    });

    function MyProfile() {
        this.update = function () {
            self = this;
            $.getJSON("standard/profile" ,function (data) {
                self.show(data);
            });
        }

        this.show = function (_profileData) {
            self = this;
            console.log(_profileData);
            getTemplate( "standard_modal_editProfile",_profileData[0]).done(function(data){
                $("#id_modalWindow").append(data).show();
                $('.modalClose').click(function() {
                    myProfile.reset();
                });
            })
        }

        this.reset = function () {
           pageOrchestrator.refresh();
           patientTable.update();
        }
    }

    function PatientTable() {
        this.update = function () {
            self = this;
            $.getJSON("standard/patients",function (data) {
                pageOrchestrator.refresh();
                self.show(data);
            });
        }
        this.show = function (_tableData) {
            getTemplate( "standard_patientList",_tableData).done(function(data){
                $('#patientTable').append(data);
                $('#id_addPatientBtn').click(function() {
                    addPatientModal.show();
                });
                $('.removePatientBtn').click(function() {
                    patientTable.deleteUser( $(this).parent().parent().parent().attr("idpatient") );
                });
                $('.modifyPatientBtn').click(function() {
                    modifyPatientModal.update( $(this).parent().parent().parent().attr("idpatient") );
                });
                $('.calendarBtn').click(function() {
                    alarmTable.update( $(this).parent().parent().attr("idpatient") );
                });
            })
        }
        this.deleteUser = function (_id){
            $.ajax({
                url: '/standard/patient/'+_id,
                type: 'DELETE',
                success: function() {
                    b2home();
                }
            });
        }
        this.reset = function () {
            $('#patientTable').empty();
        }
    }

    function AddPatientModal(_target) {
        this.show = function () {
            self = this;
            getTemplate( "standard_modal_newPatient",null).done(function(data){
                $("#id_modalWindow").append(data).show();
                $('.modalClose').click(function() {
                    addPatientModal.reset();
                });
            })
        }
        this.reset = function () {
            modalReset();
        }
    }

    function ModifyPatientModal(_target) {
        this.update = function (_idPatient) {
            self = this;
            $.getJSON("standard/patient/" + _idPatient,function (_patientData) {
                self.show(_idPatient, _patientData[0]);
            });
        }

        this.show = function (_idPatient, _patientData) {
            self = this;
            getTemplate( "standard_modal_modifyPatient",_patientData).done(function(data){
                $("#id_modalWindow").append(data).show();
                $('.modalClose').click(function() {
                    addPatientModal.reset();
                });
                $('.sendModify').click(function() {
                    $("#id_modifyPatientForm").attr('action', '/standard/patient/' + _idPatient).submit();
                });
            })
        }
        this.reset = function () {
           modalReset();
    }
    }

    function AlarmTable() {
        this.update = function (_id) {
            var self = this;
            $.ajax({
                url: '/schedule/alarms/'+_id,
                type: 'GET',
                success: function(data) {
                    console.log(data)
                    pageOrchestrator.refresh();
                    self.idPatient = _id;
                    self.show(data);
                }
            });
        }
        this.show = function (_tableData) {
            var self = this;
            getTemplate( "schedule_alarmList",_tableData).done(function(data){
                $('#patientTable').append(data);
                $('#id_addAlarmBtn').click(function() {
                    addAlarmModal.show(self.idPatient);
                });
                $('#id_backToPatientBtn').click(function() {
                    pageOrchestrator.refresh();
                    patientTable.update();
                });
                $('.removeAlarmBtn').click(function() {
                    alarmTable.deleteUser( $(this).parent().parent().parent().attr("idalarm") );
                });
                $('.modifyAlarmBtn').click(function() {
                    modifyAlarmModal.update( $(this).parent().parent().parent().attr("idalarm"),self.idPatient );
                });
            })
        }
        this.deleteUser = function (_id){
            var self = this;
            $.ajax({
                url: '/schedule/alarm/'+_id,
                type: 'DELETE',
                success: function() {
                    b2patient(self.idPatient);
                }
            });
        }
        this.reset = function () {
            $('#patientTable').empty();
        }
    }

    function AddAlarmModal(_target) {
        this.show = function (_id) {
            this.idPatient = _id;
            self = this;
            getTemplate( "schedule_modal_newAlarm",null).done(function(data){
                $("#id_modalWindow").append(data).show();
                var hider = function(){
                    $("#id_xMins").hide();
                    $("#id_xHours").hide();
                    $("#id_days").hide();
                };
                hider();
                $('#id_sendNewAlarm').hide();
                $('#id_pattern').change(function() {
                    if ($(this).val() === 'None'){
                        hider();
                        $('#id_sendNewAlarm').hide();
                    }
                    if ($(this).val() === 'xMins'){
                        hider();
                        $("#id_xMins").show();
                        $('#id_sendNewAlarm').show();

                    }
                    if ($(this).val() === 'xHours'){
                        hider();
                        $("#id_xHours").show();
                        $('#id_sendNewAlarm').show();
                    }
                    if ($(this).val() === 'everyDayAtX'){
                        hider();
                        $("#id_xMins").show();
                        $("#id_xHours").show();
                        $('#id_sendNewAlarm').show();
                    }
                    if ($(this).val() === 'onDayAtX'){
                        hider();
                        $("#id_xMins").show();
                        $("#id_xHours").show();
                        $("#id_days").show();
                        $('#id_sendNewAlarm').show();
                    }
                });

                $('#id_sendNewAlarm').click(function() {
                    var formData = $('#id_newAlarmForm').serializeArray().reduce(function(obj, item) {
                        obj[item.name] = item.value;
                        return obj;
                    }, {});

                    const days = [];
                    const daysString = [];
                    if($('#id_sunday').prop('checked')) {
                        days.push(0);
                        daysString.push("Sunday");
                    }
                    if($('#id_monday').prop('checked')) {
                        days.push(1);
                        daysString.push("Monday");
                    }
                    if($('#id_tuesday').prop('checked')) {
                        days.push(2);
                        daysString.push("Tuesday");
                    }
                    if($('#id_wednesday').prop('checked')) {
                        days.push(3);
                        daysString.push("Wednesday");
                    }
                    if($('#id_thursday').prop('checked')) {
                        days.push(4);
                        daysString.push("Thursday");
                    }
                    if($('#id_friday').prop('checked')) {
                        days.push(5);
                        daysString.push("Friday");
                    }if($('#id_saturday').prop('checked')) {
                        days.push(6);
                        daysString.push("Saturday");
                    }
                    var patternVal = $('#id_pattern').val();
                    var cron,cronString;
                    if (patternVal === 'xMins'){
                        cronString = "Every "+ formData.xMins + " Minutes";
                        cron = "*/"+ formData.xMins +" * * * *";
                    }
                    if (patternVal === 'xHours'){
                        cronString = "Every "+ formData.xHours + " Hours";
                        cron = "0 */"+ formData.xHours +" * * *";
                    }
                    if (patternVal === 'everyDayAtX'){
                        cronString = "Every Day at "+ formData.xHours + " " + formData.xMins;
                        cron = formData.xMins + " " + formData.xHours +" * * *";
                    }
                    if (patternVal === 'onDayAtX'){
                        cronString = "Every "+ daysString.join() +" at "+ formData.xHours + " " + formData.xMins;
                        cron = formData.xMins + " " + formData.xHours +" * * " + days.join();
                    }

                    var settings = {
                        "url": "schedule/alarms",
                        "method": "POST",
                        "timeout": 0,
                        "headers": {
                            "Content-Type": "application/x-www-form-urlencoded"
                        },
                        "data": {
                            "idPatient": _id,
                            "message": formData.message,
                            "cron": cron,
                            "cronString": cronString
                        }
                    };
                    $.ajax(settings).done(function (response) {
                        pageOrchestrator.refresh();
                        alarmTable.update(response.idPatient);
                    });
                });

                $('.modalClose').click(function() {
                    addAlarmModal.reset();
                });
            })
        }
        this.reset = function () {
            modalReset();
        }
    }

    function ModifyAlarmModal(_target) {
        this.update = function (_idAlarm, _idPatient) {
            self = this;
            $.getJSON("schedule/alarm/" + _idAlarm,function (_alarmData) {
                console.log(_alarmData);
                self.show(_idAlarm, _idPatient, _alarmData[0]);
            });
        }

        this.show = function (_idAlarm , _idPatient, _alarmData) {
            self = this;
            getTemplate( "schedule_modal_modifyAlarm",_alarmData).done(function(data){
                $("#id_modalWindow").append(data).show();
                var hider = function(){
                    $("#id_xMins").hide();
                    $("#id_xHours").hide();
                    $("#id_days").hide();
                };
                hider();
                $('#id_sendNewAlarm').hide();
                $('#id_pattern').change(function() {
                    if ($(this).val() === 'None'){
                        hider();
                        $('#id_sendNewAlarm').hide();
                    }
                    if ($(this).val() === 'xMins'){
                        hider();
                        $("#id_xMins").show();
                        $('#id_sendNewAlarm').show();

                    }
                    if ($(this).val() === 'xHours'){
                        hider();
                        $("#id_xHours").show();
                        $('#id_sendNewAlarm').show();
                    }
                    if ($(this).val() === 'everyDayAtX'){
                        hider();
                        $("#id_xMins").show();
                        $("#id_xHours").show();
                        $('#id_sendNewAlarm').show();
                    }
                    if ($(this).val() === 'onDayAtX'){
                        hider();
                        $("#id_xMins").show();
                        $("#id_xHours").show();
                        $("#id_days").show();
                        $('#id_sendNewAlarm').show();
                    }
                });

                $('#id_modifyAlarm').click(function() {
                    var formData = $('#id_modifyAlarmForm').serializeArray().reduce(function(obj, item) {
                        obj[item.name] = item.value;
                        return obj;
                    }, {});

                    const days = [];
                    const daysString = [];
                    if($('#id_sunday').prop('checked')) {
                        days.push(0);
                        daysString.push("Sunday");
                    }
                    if($('#id_monday').prop('checked')) {
                        days.push(1);
                        daysString.push("Monday");
                    }
                    if($('#id_tuesday').prop('checked')) {
                        days.push(2);
                        daysString.push("Tuesday");
                    }
                    if($('#id_wednesday').prop('checked')) {
                        days.push(3);
                        daysString.push("Wednesday");
                    }
                    if($('#id_thursday').prop('checked')) {
                        days.push(4);
                        daysString.push("Thursday");
                    }
                    if($('#id_friday').prop('checked')) {
                        days.push(5);
                        daysString.push("Friday");
                    }if($('#id_saturday').prop('checked')) {
                        days.push(6);
                        daysString.push("Saturday");
                    }
                    var patternVal = $('#id_pattern').val();
                    var cron,cronString;
                    if (patternVal === 'xMins'){
                        cronString = "Every "+ formData.xMins + " Minutes";
                        cron = "*/"+ formData.xMins +" * * * *";
                    }
                    if (patternVal === 'xHours'){
                        cronString = "Every "+ formData.xHours + " Hours";
                        cron = "0 */"+ formData.xHours +" * * *";
                    }
                    if (patternVal === 'everyDayAtX'){
                        cronString = "Every Day at "+ formData.xHours + " " + formData.xMins;
                        cron = formData.xMins + " " + formData.xHours +" * * *";
                    }
                    if (patternVal === 'onDayAtX'){
                        cronString = "Every "+ daysString.join() +" at "+ formData.xHours + " " + formData.xMins;
                        cron = formData.xMins + " " + formData.xHours +" * * " + days.join();
                    }

                    var settings = {
                        "url": "schedule/alarm/"+ _idAlarm,
                        "method": "POST",
                        "timeout": 0,
                        "headers": {
                            "Content-Type": "application/x-www-form-urlencoded"
                        },
                        "data": {
                            "idPatient": _idPatient,
                            "message": formData.message,
                            "cron": cron,
                            "cronString": cronString
                        }
                    };
                    $.ajax(settings).done(function (response) {
                        pageOrchestrator.refresh();
                        alarmTable.update(response[0].idPatient);
                    });
                });

                $('.modalClose').click(function() {
                    modifyAlarmModal.reset();
                });
            })
        }
        this.reset = function () {
            modalReset();
        }
    }



    function PageOrchestrator() {
        this.start = function () {
            patientTable = new PatientTable();
            addPatientModal = new AddPatientModal();
            modifyPatientModal = new ModifyPatientModal();

            alarmTable = new AlarmTable();
            addAlarmModal = new AddAlarmModal();
            modifyAlarmModal = new ModifyAlarmModal();
            myProfile = new MyProfile();

            getTemplate( "header",null).done(function(data){
                $('header').append(data);
                $('#id_profile').click(function() {
                    myProfile.update();
                });
            })
        }
        this.refresh = function () {
            patientTable.reset();
            modalReset();
        }
    }

    function modalReset() {
        $("#id_modalWindow").empty().hide();
    }

    function b2home(){
        pageOrchestrator.refresh();
        patientTable.update();
    }

    function b2patient(_id){
        pageOrchestrator.refresh();
        alarmTable.update(_id);
    }
});