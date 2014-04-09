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

    return sensorControllerInstance;
};

module.exports = constructor();