var pg = require('pg');

var constructor = function() {

    var sensorControllerInstance = {};

    sensorControllerInstance.getSensorTypes = function(req, res){

        pg.connect( process.env.DATABASE_URL, function(err, client, done) {
            client.query('SELECT * FROM sensor_type;', function(err, result) {
                done();

                if(err) return console.error(err);

                res.json(result.rows);
            });
        });
    }

    return sensorControllerInstance;
};

module.exports = constructor();