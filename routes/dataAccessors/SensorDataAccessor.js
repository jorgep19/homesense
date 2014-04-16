var constructor = function() {

    var pg = require('pg');
    var sensorDataAccessorInstance = {};

    // gets all the supported sensor types from the database
    sensorDataAccessorInstance.getSensorTypes = function(sendResponse){
        pg.connect( process.env.DATABASE_URL, function(err, client, done) {
            client.query('SELECT * FROM sensor_type;', function(err, result) {
                done();

                sendResponse(err,result.rows);
            });
        });
    };

    sensorDataAccessorInstance.recordSensorReadings = function(data, res) {

        pg.connect(process.env.DATABASE_URL, function(err, client) {
            var queryTemplate = "INSERT INTO sensor_data (cusID, sensID, sdataValue, sdatarecordeddate) VALUES (" +
                "$1," +
                "$2," +
                "$3," +
                "$4)" +
                "RETURNING sdataid";
            var inserts;


            var i, count = 0;

            for (i = 0; i < data.sensors.length; i++) {
                inserts = [ data.userId, data.sensors[i].sensorId, data.sensors[i].value, data.sensors[i].date ];

                client.query(
                    queryTemplate,
                    inserts,
                    function(err, result) {
                        if (err) {
                            console.log(err);
                        } else {

                            console.log('saved data with id: ' + result.rows[0].sdataid);
                            res.write('row inserted with id: ' + result.rows[0].sdataid + '\n');
                        }

                        count++;
                        console.log('count = ' + count);
                        if (count == data.sensors.length) {
                            client.end();
                            res.send();
                        }
                    });
            }
        });
    };

    sensorDataAccessorInstance.registerSensors = function(userId, piId, sensors, sendData) {

        pg.connect(process.env.DATABASE_URL, function(err, client) {
            var queryTemplate = "INSERT INTO sensor( cusid, devid, stypeid,  sensdesc) VALUES (" +
                "$1," +
                "$2," +
                "$3," +
                "$4)" +
                "RETURNING sensdesc, (SELECT stypedesc FROM sensor_type WHERE stypeid = $3)";
            var inserts;
            var sensorDataInserted = [];

            var i, count = 0;

            for (i = 0; i < sensors.length; i++) {
                inserts = [ userId, piId, sensors[i].sensorType, sensors[i].sensorDesc ];

                client.query(
                    queryTemplate,
                    inserts,
                    function(err, result) {
                        if (err) {
                            console.log(err);
                        } else {
                            sensorDataInserted.push( { sensorDesc: result.rows[0].sensdesc, sensorType: result.rows[0].stypedesc } );
                        }

                        count++;
                        console.log('count = ' + count);
                        if (count == sensors.length) {
                            client.end();
                            sendData(undefined, sensorDataInserted);
                        }
                    });
            }
        });
    };

    sensorDataAccessorInstance.getTemperatureData = function (sensorId, sendResponse){
        var queryTemplate = "SELECT sdatavalue, sdatarecordeddate FROM sensor S, sensor_data D " +
            "WHERE S.sensid = D.sensid AND S.sensid = $1 AND stypeid = 1" +
            "ORDER BY sdatarecordeddate DESC";
        var inserts = [ sensorId ];

        pg.connect( process.env.DATABASE_URL, function(err, client, done) {
            client.query(queryTemplate, inserts, function(err, result) {
                done();

                sendResponse(err, result.rows)
            });
        });
    };


    return sensorDataAccessorInstance;
}

module.exports = constructor();