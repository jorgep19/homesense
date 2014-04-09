var constructor = function() {

    var pg = require('pg');
    var customerDataAccessorInstance = {};

    customerDataAccessorInstance.authenticateCustomer = function authenticate(data, res, finishAuth) {

        var queryTemplate = "SELECT * FROM customer WHERE cusEmail = $1 AND cusPassword = $2";
        var inserts = [ data.email, data.password ];

        pg.connect(process.env.DATABASE_URL, function(err, client, done) {
            client.query(queryTemplate, inserts, function(err, result) {
                done();

                console.log('found user for ' + data.email);
                console.log(result.rows);

                finishAuth(err, result.rows);
            });
        });
    };

    customerDataAccessorInstance.insertUserToDb = function(data, response, sendResponse) {

        var queryTemplate = "INSERT INTO customer " +
            "(cusFirst, cusLast, cusEmail, cusPassword) " +
            "VALUES " +
            "('', '', $1, $2)";

        var inserts = [data.email, data.password ];

        pg.connect(process.env.DATABASE_URL, function(err, client, done) {
            client.query(queryTemplate, inserts, function(err, result) {
                done();

                sendResponse(err, response, result);
            });
        });
    };

    return customerDataAccessorInstance;
}

module.exports = constructor();