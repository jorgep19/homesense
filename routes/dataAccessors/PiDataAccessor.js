var constructor = function() {

    var pg = require('pg');
    var piDataAccessorIntance = {};

    piDataAccessorIntance.verifyPi = function(piCode, sendResponse) {
        var queryTemplate = 'UPDATE device SET (devactivated) = (TRUE)' +
            'WHERE devid = $1;';
        var inserts = [piCode];

        pg.connect(process.env.DATABASE_URL, function(err, client, done) {
            client.query(queryTemplate, inserts, function(err, result) {
                done();

                if(err) {
                    sendResponse(err);
                } else if (result.rowCount <= 0) {
                    sendResponse(err, { count: result.rowCount } );
                } else {
                    piDataAccessorIntance.getPiAndUserId(piCode, sendResponse);
                }
            });
        });
    };

    piDataAccessorIntance.getPiAndUserId = function(piId, sendData) {
        var queryTemplate ='SELECT devid, cusid FROM device WHERE devId = $1';
        var inserts = [ piId ]

        pg.connect( process.env.DATABASE_URL, function(err, client, done) {
            client.query(queryTemplate, inserts,function(err, result) {
                done();

                if(result.rowCount > 0) {
                    sendData( err, { count: result.rowCount, piInfo: { piId: result.rows[0].devid, userId: result.rows[0].cusid } });
                } else {
                    sendData(err, { count: result.rowCount } )
                }

            });
        });
    };

    piDataAccessorIntance.getSensorUpdate = function(data, sendResponse){

        pg.connect(process.env.DATABASE_URL, function(err, client, done) {
            var queryTemplate = 'SELECT sensid, stypeid, sensdesc FROM sensor WHERE devid = $1 AND cusid = $2';
            var inserts = [data.piId, data.userId];

            client.query(queryTemplate, inserts, function(err, result) {
                done();

                sendResponse(err, result.rows);
            });
        });
    };

    return piDataAccessorIntance;
}

module.exports = constructor();