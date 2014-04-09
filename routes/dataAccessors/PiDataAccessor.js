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
                    sendResponse(err, result.devDesc);
                } else {
                    // TODO try to retrieve data from the result of the query
                    console.log(result);
                    console.log(result.rowCount);
                    sendResponse(undefined, result.rowCount);
                }
            });
        });
    };

    return piDataAccessorIntance;
}

module.exports = constructor();