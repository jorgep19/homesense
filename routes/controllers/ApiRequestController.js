var constructor = function() {

    var ApiRequestControllerInstance = {};
    var userController = require('./UserController.js');
    var piController = require('./PiController.js');
    var sensorController = require('./SensorController.js');

    ApiRequestControllerInstance.registerUser = function(req, res){
        var result = { hasErrors: false, messages: [] };

        userController.signupUser(req.body, result, function(responseResult){

            res.json(responseResult);
        });
    };

    return ApiRequestControllerInstance;
};

module.exports = constructor();