$(function(){
    let userTable,
        addUserModal,
        modifyUserModal,
        resetSelfPasswordModal,
        resetUserPasswordModal,
        myProfile,
        pageOrchestrator = new PageOrchestrator();

    $(function() {
        pageOrchestrator.start();
        userTable.update();
    });

    function MyProfile() {
        this.update = function () {
            self = this;
            $.getJSON("admin/profile",function (data) {
                self.show(data);
            });
        }

        this.show = function (_profileData) {
            self = this;
            console.log(_profileData);
            getTemplate( "admin_modal_editProfile",_profileData[0]).done(function(data){
                $("#id_modalWindow").append(data).show();
                $('.editProfileBtn').click(function() {
                    var formData = $('#id_editProfileForm').serializeArray().reduce(function(obj, item) {
                        obj[item.name] = item.value;
                        return obj;
                    }, {});
                    var settings = {
                        "url": '/admin/profile',
                        "method": "POST",
                        "timeout": 0,
                        "headers": {
                            "Content-Type": "application/x-www-form-urlencoded"
                        },
                        "data": {
                            "email": formData.email,
                            "name": formData.name,
                            "surname": formData.surname,
                        },
                        error: function (response) {
                            if (response.responseJSON.message === undefined)
                                alert("Error, check all form fields and retry");
                            else alert(response.responseJSON.message);
                        },
                        success: function () {
                            pageOrchestrator.refresh();
                            userTable.update();
                        }
                    };
                    $.ajax(settings);
                });
                $('.modalClose').click(function() {
                    myProfile.reset();
                });
                $('.resetPwBtn').click(function() {
                    myProfile.reset();
                    resetSelfPasswordModal.show();
                });
            })
        }

        this.reset = function () {
            modalReset();
        }
    }

    function UserTable() {
        this.update = function () {
            self = this;
            $.getJSON("admin/list",function (data) {
                pageOrchestrator.refresh();
                self.show(data);
            });
        }
        this.show = function (_tableData) {
            getTemplate( "admin_usersList",_tableData).done(function(data){
                $('#userTable').append(data);
                $('#id_addUserBtn').click(function() {
                    addUserModal.show();
                });
                $('.removeUserBtn').click(function() {
                    userTable.deleteUser( $(this).parent().parent().parent().attr("idUser") );
                });
                $('#id_exportBtn').click(function() {
                    window.location = "/admin/export";
                });
                $('.modifyUserBtn').click(function() {
                    modifyUserModal.update( $(this).parent().parent().parent().attr("idUser") );
                });
                $('.resetUserPwBtn').click(function() {
                    resetUserPasswordModal.show( $(this).parent().parent().attr("idUser") );
                });
                $('.loginAsStandardBtn').click(function() {
                    let idUser = $(this).parent().parent().attr("idUser");
                    var settings = {
                        "url": "admin/standard-login/"+idUser,
                        "method": "GET",
                        "timeout": 0,
                    };
                    $.ajax(settings).done(function (response) {
                        window.location.replace("/standard");
                    });

                });
            })
        }
        this.deleteUser = function (_id){
            $.ajax({
                url: '/admin/user/'+_id,
                type: 'DELETE',
                success: function() {
                    b2home();
                }
            });
        }
        this.reset = function () {
            $('#userTable').empty();
        }
    }

    function AddUserModal(_target) {
        this.show = function () {
            self = this;
            getTemplate( "admin_modal_newUser",null).done(function(data){
                $("#id_modalWindow").append(data).show();
                $("#id_createUserBtn").click(function() {
                    var formData = $('#id_newUserForm').serializeArray().reduce(function(obj, item) {
                        obj[item.name] = item.value;
                        return obj;
                    }, {});
                    var settings = {
                        "url": '/admin/createNewUser',
                        "method": "POST",
                        "timeout": 0,
                        "headers": {
                            "Content-Type": "application/x-www-form-urlencoded"
                        },
                        "data": {
                            "email": formData.email,
                            "name": formData.name,
                            "surname": formData.surname,
                            "password": formData.password,
                        },
                        error: function (response) {
                            if (response.responseJSON.message === undefined)
                                alert("Error, check all form fields and retry");
                            else alert(response.responseJSON.message);
                        },
                        success: function () {
                            pageOrchestrator.refresh();
                            userTable.update();
                        }
                    };
                    $.ajax(settings);
                });
                $('.modalClose').click(function() {
                    addUserModal.reset();
                });
            })
        }
        this.reset = function () {
            modalReset();
        }
    }

    function ModifyUserModal(_target) {
        this.update = function (_idUser) {
            self = this;
            $.getJSON("admin/user/" + _idUser,function (_userData) {
                self.show(_idUser, _userData[0]);
            });
        }

        this.show = function (_idUser, _userData) {
            self = this;
            getTemplate( "admin_modal_modifyUser",_userData).done(function(data){
                $("#id_modalWindow").append(data).show();
                $('.modalClose').click(function() {
                    addUserModal.reset();
                });
                $('.sendModify').click(function() {
                    var formData = $('#id_modifyUserForm').serializeArray().reduce(function(obj, item) {
                        obj[item.name] = item.value;
                        return obj;
                    }, {});
                    var settings = {
                        "url": '/admin/user/' + _idUser + '/modify',
                        "method": "POST",
                        "timeout": 0,
                        "headers": {
                            "Content-Type": "application/x-www-form-urlencoded"
                        },
                        "data": {
                            "email": formData.email,
                            "name": formData.name,
                            "surname": formData.surname,
                        },
                        error: function (response) {
                            if (response.responseJSON.message === undefined)
                                alert("Error, check all form fields and retry");
                            else alert(response.responseJSON.message);
                        },
                        success: function () {
                            pageOrchestrator.refresh();
                            userTable.update();
                        }
                    };
                    $.ajax(settings);
                });
            })
        }
        this.reset = function () {
            modalReset();
    }
    }

    function ResetUserPassword(_target) {
        this.show = function (_id) {
            self = this;
            getTemplate( "admin_modal_resetPassword",null).done(function(data){
                $("#id_modalWindow").append(data).show();
                $('.modalClose').click(function() {
                    resetUserPasswordModal.reset();
                });
                $('.sendResetPassword').click(function() {
                    if($("#id_Password").val().length>=5){
                        var formData = $('#id_resetPasswordForm').serializeArray().reduce(function(obj, item) {
                            obj[item.name] = item.value;
                            return obj;
                        }, {});
                        var settings = {
                            "url": '/admin/user/' + _id + '/reset',
                            "method": "POST",
                            "timeout": 0,
                            "headers": {
                                "Content-Type": "application/x-www-form-urlencoded"
                            },
                            "data": {
                                "password": formData.password,
                            },
                            error: function () {
                                alert("Error, check all form fields and retry");
                            },
                            success: function () {
                                pageOrchestrator.refresh();
                                userTable.update();
                            }
                        };
                        $.ajax(settings);
                    }
                    else{
                        alert("The password has to be at least 5 characters long");
                        return false;
                    }
                });
            })
        }
        this.reset = function () {
            modalReset();
        }
    }

    function ResetSelfPassword(_target) {
        this.show = function () {
            self = this;
            getTemplate( "self_modal_resetPassword",null).done(function(data){
                $("#id_modalWindow").append(data).show();
                $('.modalClose').click(function() {
                    resetSelfPasswordModal.reset();
                });
                $('.sendResetPassword').click(function() {
                    if($("#id_Password").val().length>=5) {
                        var formData = $('#id_selfResetPasswordForm').serializeArray().reduce(function(obj, item) {
                            obj[item.name] = item.value;
                            return obj;
                        }, {});
                        var settings = {
                            "url": '/admin/resetPassword',
                            "method": "POST",
                            "timeout": 0,
                            "headers": {
                                "Content-Type": "application/x-www-form-urlencoded"
                            },
                            "data": {
                                "password": formData.password,
                            },
                            error: function () {
                                alert("Error, check all form fields and retry");
                            },
                            success: function () {
                                pageOrchestrator.refresh();
                                userTable.update();
                            }
                        };
                        $.ajax(settings);
                    }
                    else{
                        alert("The password has to be at least 5 characters long");
                        return false;
                    }
                });
            })
        }
        this.reset = function () {
            modalReset();
        }
    }

    function PageOrchestrator() {
        this.start = function () {
            userTable = new UserTable();
            addUserModal = new AddUserModal();
            modifyUserModal = new ModifyUserModal();
            resetUserPasswordModal = new ResetUserPassword();
            resetSelfPasswordModal = new ResetSelfPassword();
            myProfile = new MyProfile();

            getTemplate( "header",null).done(function(data){
                $('header').append(data);
                $('#id_profile').click(function() {
                    myProfile.update();
                });
            })
        }
        this.refresh = function () {
            userTable.reset();
            modalReset();
        }
    }

    function modalReset() {
        $("#id_modalWindow").empty().hide();
    }

    function b2home(){
        pageOrchestrator.refresh();
        userTable.update();
    }
});