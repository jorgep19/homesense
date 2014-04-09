var constructor = function() {

    var pg = require('pg');
    var sensorDataAccessorInstance = {};

    sensorDataAccessorInstance.getSensorTypes = function() {

    };

    return sensorDataAccessorInstance;
}

module.exports = constructor();