var pg = require('pg');

var constructor = function() {

    var piControllerInstance = {};
    var piDA = require('../dataAccessors/PiDataAccessor.js');

    // TODO implement
    piControllerInstance.verifyPi = function(req, res) {
        var data = req.body;
        var response = { hasErrors: false, messages: [] };

        // TODO fully implement this validations
        if(data.piCode && data.piCode.length === 0)
        {
            response.hasErrors = true;
            response.messages.push("Pi Code is required");
        }

        if(!response.hasErrors) {
            piDA.verifyPi(data.piCode, function(err, data) {
                if(err) {
                    response.hasErrors = true;
                    response.messages.push("Couldn't verify pi");
                } else if (data.count === 0 ) {
                    response.hasErrors = true;
                    response.messages.push("Couldn't verify pi. Please verify your code.");
                }

                if(!response.hasErrors) {
                    response.data = data.piInfo;
                    response.hasErrors = false;
                    response.messages.push("Your pi has been verified :)");
                }

                res.json(response);
            });
        } else {
            res.json(response);
        }
    };

    piControllerInstance.getSensorUpdate = function(req, res) {
        var data = req.body;
        var response = { hasErrors: false, messages: [] };

        // TODO fully implement this validations
        if(data.piCode && data.piCode.length === 0)
        {
            response.hasErrors = true;
            response.messages.push("Pi Code is required");
        }

        if(data.userId && data.userId.length === 0)
        {
            response.hasErrors = true;
            response.messages.push("Pi Code is required");
        }

        if(!response.hasErrors) {
            piDA.getSensorUpdate(data, function(err, data) {
                if(err) {
                    response.hasErrors = true;
                    response.messages.push('Something went wrong');
                } else {
                    response.sensors = data;
                }

                res.json(response);
            });
        } else {
            res.json(response);
        }
    }

    return piControllerInstance;
};

module.exports = constructor();