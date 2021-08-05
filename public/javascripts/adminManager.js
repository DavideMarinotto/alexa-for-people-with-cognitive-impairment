$(function(){
    let userTable,
        addUserModal,
        pageOrchestrator = new PageOrchestrator();

    $(function() {
        pageOrchestrator.start();
        userTable.update();
    });

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
            $("#id_modalWindow").empty().hide();
    }
    }


    function PageOrchestrator() {
        this.start = function () {
            userTable = new UserTable();
            addUserModal = new AddUserModal();

            getTemplate( "header",null).done(function(data){
                $('header').append(data);
            })
        }
        this.refresh = function () {
            userTable.reset();
            addUserModal.reset();
        }
    }

    function b2home(){
        pageOrchestrator.refresh();
        userTable.update();
    }
});