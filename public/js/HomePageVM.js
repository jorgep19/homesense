function loginVM() {
    var self = this;

    // could also be te user's email
    self.email = ko.observable("");
    self.password = ko.observable("");
    self.passwordRetype = ko.observable("");
}

loginVM.prototype.doLogin = function(){
    var self = this;

    $.ajax({
        type: "POST",
        url: "http://localhost:8080/api/customer/login",
        data: { email : self.email(), password: self.password }
    }).done(function(data) {
            if(data.hasErrors)
            {
                alert(data.messages);
            }
            else
            {
                window.location = './pages/dashboard.html';
            }
        });
};

ko.applyBindings(new loginVM());