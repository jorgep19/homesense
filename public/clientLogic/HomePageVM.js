function loginVM() {
    var self = this;

    // could also be te user's email
    self.email = ko.observable("");
    self.password = ko.observable("");
    self.passwordRetype = ko.observable("");
}

loginVM.prototype.doLogin = function(){
    var self = this;

    var successHandler = function(data) {
        console.log(data);
    };

    $.ajax({
        type: "POST",
        url: "http://localhost:5000/api/login/",
        data: { email : self.email(), password: self.password },
        success: successHandler
    });
};

ko.applyBindings(new loginVM());