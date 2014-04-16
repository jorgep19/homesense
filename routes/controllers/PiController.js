var pg = require('pg');

var constructor = function() {

    var piControllerInstance = {};
    var piDA = require('../dataAccessors/PiDataAccessor.js');
    var sensorDA = require('../dataAccessors/SensorDataAccessor.js');

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


    piControllerInstance.registerPiForUser = function(data, responseHandler){

        var response = { hasErrors: false, messages: [] };

        if(!data.userId) {
            response.messages.push( 'There was problem with your session please log in again.' );
            response.hasErrors = true;
        }

        if(!data.piName) {
            response.messages.push( 'The Pi needs name' );
            response.hasErrors = true;
        }

        for(var i = 0; i < data.sensors.length; i++) {
            if ( !data.sensors[i].sensorDesc ) {
                response.messages.push( 'All sensors must have a name' );
                response.hasErrors = true;
                break;
            }

            if ( !data.sensors[i].sensorType ) {
                response.messages.push( 'All sensors must have a name' );
                response.hasErrors = true;
                break;
            }
        }

        if(!response.hasErrors) {
            piDA.registerPiForUser(data, function(err, piInsertData) {


                if(err) {
                    response.hasErrors = true;
                    response.messages.push('Something went wrong');
                    responseHandler(response);
                } else {

                    sensorDA.registerSensors(data.userId, piInsertData.piId, data.sensors, function(err, sensorInsertData) {
                        if(err) {
                            response.hasErrors = true;
                            response.messages.push('Something went wrong');
                            responseHandler(response);
                        } else {
                            var dataToReturn = { piDesc: piInsertData.piDesc, piCode: piInsertData.piId, sensors: sensorInsertData };
                            responseHandler(response, dataToReturn);
                        }
                    });
                }
            });
        } else {
            responseHandler(response);
        }

    }

    return piControllerInstance;
};

module.exports = constructor();