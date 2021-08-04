$(function(){
    let userTable,
        pageOrchestrator = new PageOrchestrator();

    $(function() {
        pageOrchestrator.start();
        userTable.update();
    });

    function UserTable() {
        this.update = function () {
            self = this;
            $.getJSON("admin/list",function (data) {
                self.show(data);
            });
        }

        this.show = function (_tableData) {
            pageOrchestrator.refresh();
            getTemplate( "admin",_tableData).done(function(data){
                $('#userTable').append(data)
            })
        }

        this.reset = function () {
            $('#userTable').empty();
        }
    }
    function PageOrchestrator() {
        this.start = function () {
            userTable = new UserTable();
        }
        this.refresh = function () {
            userTable.reset();
        }
    }

});