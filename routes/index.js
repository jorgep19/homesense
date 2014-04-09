var app = require('../app.js'),
    sensorController = require('./controllers/SensorController.js'),
    userController = require('./controllers/UserController.js');

// 'middleware' for routes that require to be logged in
var checkSessionBeforeExec = function(requestHandler) {

    return function(req, res) {

        console.log(req.session);
        if(!req.session.userCode)
        {
            console.log('no session');
            res.send('You must login first');
        } else {
            console.log('going to the handler');
            requestHandler(req, res);
        }
    };
};

// TEST ROUTES
app.get('/', function(req, res){ res.send('Server is running') });
app.get('/dbtest', checkSessionBeforeExec(sensorController.getSensorTypes) );

// PI ROUTES
// TODO implement app.post('/api/pi/verify', );
// TODO implement app.post('/api/pi/update', );
// TODO implement app.post('/api/pi/settings/update', );
// TODO implement app.post('/api/pi/put/data', );

// CLIENTS ROUTES
app.post('/api/customer/register', userController.registerUser);            // basic support
app.post('/api/login/', userController.login);                              // basic support
app.post('/api/logout', checkSessionBeforeExec(userController.logout) );
// TODO implement app.get('/api/customer/get/summary/data', );
// TODO implement app.get('/api/sensor/get/types', );
// TODO implement app.get('/api/get/temperature/data', );
// TODO implement app.get('/api/customer/genpicode', );