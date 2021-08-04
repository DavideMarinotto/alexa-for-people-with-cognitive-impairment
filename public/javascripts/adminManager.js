$(function(){
    let userTable,
        pageOrchestrator = new PageOrchestrator();

    $(function() {
        pageOrchestrator.start();
        userTable.update();
    });

    function UserTable() {
        this.update = function () {
            let postData = {userId: "123", first_name: "Poro", last_name: "Fessor", email: "poro@fessor.com"};
            this.show(postData);
        }

        this.show = function (_tableData) {
            pageOrchestrator.refresh();
            getTemplate('admin',_tableData).done(function(data){
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