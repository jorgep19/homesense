var constructor = function() {

    var pg = require('pg');
    var customerDataAccessorInstance = {};

    // validates the credential of a user based on the database
    customerDataAccessorInstance.authenticateUser = function(data, finishAuth) {

        var queryTemplate = "SELECT * FROM customer WHERE cusEmail = $1 AND cusPassword = $2";
        var inserts = [ data.email, data.password ];

        pg.connect(process.env.DATABASE_URL, function(err, client, done) {
            client.query(queryTemplate, inserts, function(err, result) {
                done();

                finishAuth(err, result.rows);
            });
        });
    };

    // insert a user row without user data
    customerDataAccessorInstance.registerUser = function(data, sendResponse) {

        var queryTemplate = "INSERT INTO customer " +
            "(cusFirst, cusLast, cusEmail, cusPassword) " +
            "VALUES " +
            "('', '', $1, $2)" +
            "RETURNING cusid";

        var inserts = [data.email, data.password ];

        pg.connect(process.env.DATABASE_URL, function(err, client, done) {
            client.query(queryTemplate, inserts, function(err, result) {
                done();

                if(err) {
                    sendResponse(err);
                } else {
                    sendResponse(err,result.rows[0].cusid);
                }
           });
        });
    };

    customerDataAccessorInstance.savePhone = function(userId, phoneNumber, sendResponse) {

        var queryTemplate = "INSERT INTO phone_number(cusid, pcid, phtid, phnumber) VALUES ($1,1,1, $2) RETURNING cusid";

        var inserts = [userId, phoneNumber ];

        pg.connect(process.env.DATABASE_URL, function(err, client, done) {
            client.query(queryTemplate, inserts, function(err, result) {
                done();

                if(err) {
                    sendResponse(err);
                } else {
                    sendResponse(err,result.rows[0].cusid);
                }
            });
        });
    };


    // Inserst a Pi for a user account
    customerDataAccessorInstance.registerPi = function(data, userCode, sendResponse){
        var queryTemplate = 'INSERT INTO device (cusId, devDesc) ' +
            'VALUES' +
            '($1, $2)';
        var inserts = [userCode, data.piDesc ];


        pg.connect(process.env.DATABASE_URL, function(err, client, done) {
            client.query(queryTemplate, inserts, function(err, result) {
                done();

                if(err) {
                    sendResponse(err, result.devDesc);
                } else {
                    // TODO try to retrieve data from the result of the query
                    sendResponse(undefined, data.piDesc);
                }
            });
        });
    };

    // helper function for converting rows data to a json containing the data summary of the user sensors
    var createUserDataTree = function(data) {
        var userPis = [];
        var foundPiAtIndex;
        var foundPiInUserPis = false;
        var j;
        // map each row
        for(var i = 0; i < data.length; i++) {

            for(j = 0; j < userPis.length; j++) {
                if (userPis[j].id === data[i].devid) {
                    foundPiAtIndex = j;
                    foundPiInUserPis = true;
                    break;
                }
            }

            // if pi found add the sensor to the pi
            if(foundPiInUserPis) {
                userPis[foundPiAtIndex].sensorsReadings.push({ id: data[i].sensid, desc: data[i].sensdesc, type: data[i].stypedesc,
                    value: data[i].sdatavalue, timestamp: data[i].sdatarecordeddate  });
                // otherwise create the pi with the sensor
            } else {
                userPis.push(
                    {
                        id: data[i].devid, desc: data[i].devdesc, active: data[i].devactivated,
                        sensorsReadings: [ { id: data[i].sensid, desc: data[i].sensdesc, type: data[i].stypedesc,
                            value: data[i].sdatavalue, timestamp: data[i].sdatarecordeddate  } ]
                    } );
            }

            foundPiInUserPis = false;
        }

        return userPis;
    }

    customerDataAccessorInstance.getDataSummaryForUser = function(userId, manageOutput) {

        var queryTemplate = "SELECT D.devdesc, D.devactivated, S.sensdesc, data.sdatavalue, data.sdatarecordeddate , ST.stypedesc, D.devid, S.sensid " +
                            "FROM (SELECT sdatavalue, sdatarecordeddate, sensid, " +
                            "rank() OVER (PARTITION BY sensid ORDER BY sdatarecordeddate DESC) AS rank FROM sensor_data) AS data, " +
                            "sensor S, device D, sensor_type ST " +
                            "WHERE rank = 1 " +
                            "AND S.sensid = data.sensid " +
                            "AND D.devid = S.devid " +
                            "AND ST.stypeid = S.stypeid " +
                            "AND D.cusid = $1";
        var inserts = [ userId ];

        pg.connect(process.env.DATABASE_URL, function(err, client, done) {
            client.query(queryTemplate, inserts, function(err, result) {
                done();

                if(err) {
                    manageOutput(err);
                } else {
                    var userData = createUserDataTree(result.rows);
                    manageOutput(undefined, userData);
                }
            });
        });
    };

    return customerDataAccessorInstance;
}

module.exports = constructor();