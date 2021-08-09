$(function(){
    let loginForm,
        alert,
        pageOrchestrator = new PageOrchestrator();

    $(function() {
        pageOrchestrator.start();
    });

    function LoginForm() {
        this.send = function (_mail,_password) {
            var settings = {
                "url": "/auth/signin",
                "method": "POST",
                "timeout": 0,
                "headers": {
                    "Content-Type": "application/x-www-form-urlencoded"
                },
                "data": {
                    "mail": _mail,
                    "password": _password
                }
            };

            $.ajax(settings).done(function (response) {
                console.log(response);
            });
        }

        this.reset = function () {
            $('#id_loginForm :input').val('');
        }
    }

    function Alert() {
        this.throw = function () {

        }

        this.reset = function () {

        }
    }

    function PageOrchestrator() {
        this.start = function () {
            alert = new Alert();
            loginForm = new LoginForm();

            $('#id_loginBtn').click(function() {
                let mail = $('#id_mailField').val();
                let password = $('#id_passwordField').val();
                loginForm.send(mail,password);
            });
        }

        this.refresh = function () {
            loginForm.reset();
            alert.reset();
        }
    }

});