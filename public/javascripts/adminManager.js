$(function(){
    let userTable,
        addUserModal,
        modifyUserModal,
        resetPasswordModal,
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
                pageOrchestrator.refresh();
                self.show(data);
            });
        }

        this.show = function (_profileData) {
            self = this;
            console.log(_profileData);
            getTemplate( "admin_modal_editProfile",_profileData[0]).done(function(data){
                $("#id_modalWindow").append(data).show();
                $('.modalClose').click(function() {
                    myProfile.reset();
                });
            })
        }

        this.reset = function () {
            pageOrchestrator.refresh();
            userTable.update();
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
                $('.modifyUserBtn').click(function() {
                    modifyUserModal.show( $(this).parent().parent().parent().attr("idUser") );
                });
                $('.resetUserPwBtn').click(function() {
                    resetPasswordModal.show( $(this).parent().parent().attr("idUser") );
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
        this.show = function (_id) {
            self = this;
            getTemplate( "admin_modal_modifyUser",null).done(function(data){
                $("#id_modalWindow").append(data).show();
                $('.modalClose').click(function() {
                    addUserModal.reset();
                });
                $('.sendModify').click(function() {
                    $("#id_modifyUserForm").attr('action', '/admin/user/' + _id + '/modify').submit();
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
                    resetPasswordModal.reset();
                });
                $('.sendResetPassword').click(function() {
                    $("#id_resetPasswordForm").attr('action', '/admin/user/' + _id + '/reset').submit();
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
            resetPasswordModal = new ResetUserPassword();
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