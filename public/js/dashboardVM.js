/**
 * Created by jorgep on 2/23/14.
 */
function dashboardVM() {
    var self = this;

    // could also be te user's email
    self.userName = ko.observable("");
    self.email = ko.observable("");
    self.password = ko.observable("");
    self.passwordRetype = ko.observable("");
    self.successFeedback = ko.observable(false);
}

dashboardVM.prototype.addPi = function(){

    var self = this;
    window.location = 'PiManagement.html?code=' +22;
   /* $.ajax({
        type: "POST",
        url: "http://localhost:8080/api/customer/genpicode"
    }).done(function(data) {
            if(data.hasErrors)
            {
                alert(data.messages);
            }
            else
            {

            }
        });*/
};

ko.applyBindings(new dashboardVM());