var constructor = function() {

    var userControllerInstance = {};

    userControllerInstance.login = function(req, res){
        req.session.userID = req.params.userCode;
        res.send('logged in as ' + req.session.userID );
    };

    userControllerInstance.logout = function(req, res){
        delete req.session.userID;
        console.log(req.session);

        res.send('successfully logged out');
    };

    return userControllerInstance;
};

module.exports = constructor();