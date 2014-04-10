var constructor = function() {

    var sensorControllerInstance = {};
    var sensorDA = require('../dataAccessors/SensorDataAccessor.js');

    // gets all the supported sensor types
    sensorControllerInstance.getSensorTypes = function(req, res) {

        sensorDA.getSensorTypes(function(err, rows) {
            if(err) {
                // TODO check for any other errors
                res.send('Something went wrong');
            } else {
                res.json(rows);
            }
        });
    };

    sensorControllerInstance.recordSensorReadings = function(req, res) {
        sensorDA.recordSensorReadings(data, res, sensorDA.insertDataRow);
    };

    sensorControllerInstance.getTemperatureData = function(req, res){
        var data = req.params;
        var response = { hasErrors: false, messages: [] };

        if(!data.sensorId && data.sensorId.length === 0) {
            response.hasErrors = true;
            response.messages.push('Something went wrong');
        }

        if(!response.hasErrors) {
            sensorDA.getTemperatureData(data.sensorId, function(err, rows){

                if(err) {
                    response.hasErrors = true;
                    response.messages.push('Something went wrong');
                } else {

                    if(rows.length === 0) {
                        response.messages.push('No data found for this sensor :(');
                    }
                    response.data = rows;
                }

                res.json(response);
            });
        } else {
            res.json(response);
        }
    };

    return sensorControllerInstance;
};

module.exports = constructor();