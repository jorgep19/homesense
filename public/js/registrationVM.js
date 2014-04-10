function RegistrationVM() {
    var self = this;

    // could also be te user's email
    self.email = ko.observable("");
    self.password = ko.observable("");
    self.passwordRetype = ko.observable("");
    self.successFeedback = ko.observable(false);
}

RegistrationVM.prototype.createAccount = function(){
    var self = this;

    if(self.passwordRetype() !== self.password())
    {
        alert("password and retype don't match");
        return;
    }

    $.ajax({
        type: "POST",
        url: "http://localhost:8080/api/customer/register",
        data: { email : self.email(), password: self.password }
    }).done( function(){
            self.successFeedback(true); });
             window.location = "dashboard.html";
};

ko.applyBindings(new RegistrationVM());