var app = require('../app.js'),
    userController = require('./controllers/UserController.js'),
    piController = require('./controllers/PiController.js'),
    sensorController = require('./controllers/SensorController.js');

// 'middleware' for routes that require to be logged in
var checkSessionBeforeExec = function(requestHandler) {

    return function(req, res) {

        if(!req.session.userCode) {
            res.send('You must login first');
        } else {
            requestHandler(req, res);
        }
    };
};

// TEST ROUTES
app.get('/', function(req, res){ res.send('Server is running') });
app.get('/dbtest', checkSessionBeforeExec(sensorController.getSensorTypes) );

// PI ROUTES
app.post('/api/pi/verify', piController.verifyPi);                                      // basic suppor
// TODO implement app.post('/api/pi/update', );
// TODO implement app.post('/api/pi/settings/update', );
// TODO implement app.post('/api/pi/put/data', );

// CLIENTS ROUTES
app.post('/api/customer/register', userController.registerUser);                        // basic support
app.post('/api/login/', userController.login);                                          // basic support
app.post('/api/logout', checkSessionBeforeExec(userController.logout) );                // basic support
app.post('/api/customer/genpicode', checkSessionBeforeExec(userController.genPiCode) ); // basic support
// TODO implement app.get('/api/sensor/get/types', );

// TODO implement app.get('/api/customer/get/summary/data', );
// TODO implement app.get('/api/get/temperature/data', );
