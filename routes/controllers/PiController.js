var pg = require('pg');

var constructor = function() {

    var sensorControllerInstance = {};
    var piDA = require('../dataAccessors/PiDataAccessor.js');

    // TODO implement
    sensorControllerInstance.verifyPi = function(req, res) {
        var data = req.body;
        var response = { hasErrors: false, messages: [] };

        // TODO fully implement this validations
        if(data.piCode && data.piCode === 0)
        {
            response.hasErrors = true;
            response.messages.push("Pi Code is required");
        }

        if(!response.hasErrors) {
            piDA.verifyPi(data.piCode, function(err, rows) {
                if(err) {
                    response.hasErrors = true;
                    response.messages.push("Couldn't verify pi");
                } else if (rows.length === 0 ) {
                    response.hasErrors = true;
                    response.messages.push("Couldn't verify pi. Please verify your code.");
                } else {
                    response.hasErrors = false;
                    response.messages.push("Your pi has been verified :)");
                }
                res.send(response);
            });
        } else {
            res.send(response);
        }
    };

    return sensorControllerInstance;
};

module.exports = constructor();