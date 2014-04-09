var constructor = function() {

    var pg = require('pg');
    var customerDataAccessorInstance = {};

    customerDataAccessorInstance.authenticateUser = function(data, res, finishAuth) {

        var queryTemplate = "SELECT * FROM customer WHERE cusEmail = $1 AND cusPassword = $2";
        var inserts = [ data.email, data.password ];

        pg.connect(process.env.DATABASE_URL, function(err, client, done) {
            client.query(queryTemplate, inserts, function(err, result) {
                done();

                finishAuth(err, result.rows);
            });
        });
    };

    customerDataAccessorInstance.registerUser = function(data, response, sendResponse) {

        var queryTemplate = "INSERT INTO customer " +
            "(cusFirst, cusLast, cusEmail, cusPassword) " +
            "VALUES " +
            "('', '', $1, $2)";

        var inserts = [data.email, data.password ];

        pg.connect(process.env.DATABASE_URL, function(err, client, done) {
            client.query(queryTemplate, inserts, function(err, result) {
                done();

                sendResponse(err);
            });
        });
    };

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
                }
                else
                {
                    console.log('inserted devID: ' + data.piDesc);
                    sendResponse(undefined, data.piDesc);
                }
            });
        });
    };

    return customerDataAccessorInstance;
}

module.exports = constructor();