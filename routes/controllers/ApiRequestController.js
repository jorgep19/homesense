var constructor = function() {

    var ApiRequestControllerInstance = {};
    var userController = require('./UserController.js');
    var piController = require('./PiController.js');
    var sensorController = require('./SensorController.js');

    ApiRequestControllerInstance.registerUser = function(req, res){
        var result = { hasErrors: false, messages: [] };

        userController.signupUser(req.body, result, function(responseResult) {
            res.json(responseResult);
        });
    };

    ApiRequestControllerInstance.registerPi = function(req, res) {
        var data  = req.body;
        data.userId = req.session.userId;

        piController.registerPiForUser(data, function(responseResult) {
            res.json(responseResult);
        });
    };


    ApiRequestControllerInstance.login = function(req, res) {
        var result = { hasErrors: false, messages: [] };

        userController.login(req.body, result, function(responseResult){
            res.json(responseResult);
        });
    };

    ApiRequestControllerInstance.getUserDataSummary = function(req, res) {
        var result = { hasErrors: false, messages: [] };

        userController.getDataSummaryForUser(req.body.userId, result, function(responseResult) {
            res.json(responseResult);
        });
    }

    return ApiRequestControllerInstance;
};

module.exports = constructor();