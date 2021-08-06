$(function(){
    let patientTable,
        addPatientModal,
        modifyPatientModal,
        pageOrchestrator = new PageOrchestrator();

    $(function() {
        pageOrchestrator.start();
        patientTable.update();
    });

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
                    modifyPatientModal.show( $(this).parent().parent().parent().attr("idpatient") );
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
            $("#id_modalWindow").empty().hide();
        }
    }

    function ModifyPatientModal(_target) {
        this.show = function (_id) {
            self = this;
            getTemplate( "standard_modal_modifyPatient",null).done(function(data){
                $("#id_modalWindow").append(data).show();
                $('.modalClose').click(function() {
                    addPatientModal.reset();
                });
                $('.sendModify').click(function() {
                    $("#id_modifyPatientForm").attr('action', '/standard/patient/' + _id).submit();
                });
            })
        }
        this.reset = function () {
            $("#id_modalWindow").empty().hide();
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
            getTemplate( "schedule_alarmList",_tableData).done(function(data){
                $('#patientTable').append(data);
                $('#id_addAlarmBtn').click(function() {
                    addAlarmModal.show();
                });
                $('.removeAlarmBtn').click(function() {
                    alarmTable.deleteUser( $(this).parent().parent().parent().attr("idalarm") );
                });
                $('.modifyAlarmBtn').click(function() {
                    modifyAlarmModal.show( $(this).parent().parent().parent().attr("idalarm") );
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


    function PageOrchestrator() {
        this.start = function () {
            patientTable = new PatientTable();
            addPatientModal = new AddPatientModal();
            modifyPatientModal = new ModifyPatientModal();

            getTemplate( "header",null).done(function(data){
                $('header').append(data);
            })
        }
        this.refresh = function () {
            patientTable.reset();
            addPatientModal.reset();
        }
    }

    function b2home(){
        pageOrchestrator.refresh();
        patientTable.update();
    }
});