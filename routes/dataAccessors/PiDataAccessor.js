var constructor = function() {

    var pg = require('pg');
    var piDataAccessorIntance = {};

    piDataAccessorIntance.verifyPi = function(piCode, sendResponse) {
        var queryTemplate = 'UPDATE device SET (devactivated) = (TRUE)' +
            'WHERE devid = $1';
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
        var queryTemplate = 'SELECT D.devid, D.cusid, C.cusemail, P.phnumber '+
                            'FROM device D, customer C, phone_number P ' +
                            'WHERE D.devId = $1 AND C.cusid = D.cusid AND P.cusid = C.cusid';
        var inserts = [ piId ];

        pg.connect( process.env.DATABASE_URL, function(err, client, done) {
            client.query(queryTemplate, inserts,function(err, result) {
                done();

                if(result.rowCount > 0) {
                    sendData( err, { count: result.rowCount, piInfo: {
                                                                        piId: result.rows[0].devid,
                                                                        userId: result.rows[0].cusid,
                                                                        userPhoneNumber: result.rows[0].phnumber,
                                                                        userEmail: result.rows[0].cusemail

                                                                      } } );
                } else {
                    sendData(err, { count: result.rowCount } )
                }

            });
        });
    };


    piDataAccessorIntance.registerPiForUser = function(data, sendData){
        var queryTemplate = "INSERT INTO device (cusID, devdesc) VALUES ($1, $2) RETURNING devdesc, devid";
        var inserts = [data.userId, data.piName];

        pg.connect( process.env.DATABASE_URL, function(err, client, done) {
            client.query(queryTemplate, inserts,function(err, result) {
                done();

                if(err) {
                    sendData(err)
                } else {
                    sendData( err, { piDesc: result.rows[0].devdesc, piId: result.rows[0].devid} );
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