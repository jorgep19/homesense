function newPiVM() {
    var self = this;

    self.code = ko.observable("13");
}

newPiVM.prototype.goToDashboard = function() {
    window.location = 'dashboard.html?=usi=2019'
}

ko.applyBindings(new newPiVM());