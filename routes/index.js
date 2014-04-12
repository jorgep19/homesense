module.exports = function(app) {


    var userController = require('./controllers/UserController.js'),
        piController = require('./controllers/PiController.js'),
        sensorController = require('./controllers/SensorController.js'),
        webRequestController = require('./controllers/WebRequestController.js'),
        apiRequestController = require('./controllers/ApiRequestController.js');

    // 'middleware' for routes that require to be logged in
    var checkSessionBeforeExec = function(requestHandler) {

        return function(req, res) {
            if(!req.session.userId) {
                res.send('You must login first');
            } else {
                requestHandler(req, res);
            }
        };
    };

    // WEB REQUESTS

    // home page
    app.get('/', webRequestController.loadHomePage);

    // signup page
    app.get('/signup', webRequestController.loadSignup);
    app.post('/signup', webRequestController.signupUser);

    // dashboard
    app.get('/dashboard', webRequestController.loadDashboard);

    // PI API ROUTES
    // -------------------------------------------------------------------------------------
    // This URL creates a user account if possible
    // Expects a JSON of this form: { piCode: 19 }
    // Returns a JSON of this form: { hasErrors: false, messages: [], data: { piId: 21, userId: 19 } }
    // in that JSON hasErrors is a boolean that states if there was an error
    // and messages is an array of string that has either error messages
    // or a message saying that the operation was successful
    app.post('/api/pi/verify', piController.verifyPi);                                      // basic support

    // This URL creates a user account if possible
    // Expects a JSON of this form: { userId: 19, sensors : [ { sensorId: 28, value: 12, date: '2014-04-07 17:50:52.9741'}, { sensorId: 28, value: 12, date: '2014-04-07 17:50:52.9741'} ] }
    // Returns a log of the transaction that got executed
    app.post('/api/sensor/put/data', sensorController.recordSensorReadings);                // basic support


    // This URL provides an update for the pi sensors
    // Expects a JSON of this form: { piId: 21 }
    // Returns a JSON of this form: { hasErrors: false, messages: [], sensors: [ { sensid: 1, stypeid: 1, sensdesc: "Garage_Temp" }, { sensid: 1, stypeid: 1, sensdesc: "Garage_Temp" } ]
    app.post('/api/pi/update',  piController.getSensorUpdate);

    // CLIENTS API ROUTES
    // -------------------------------------------------------------------------------------
    // This URL creates a user account if possible
    // Expects a JSON of this form: { email: 'dummie@foo.bar', password: '123', passwordRetype: '123' }
    // Returns a JSON of this form: { hasErrors: false, messages: [] }
    // in that JSON hasErrors is a boolean that states if there was an error
    // and messages is an array of string that has either error messages
    // or a message saying that the operation was successful
    app.post('/api/customer/register', apiRequestController.registerUser);                        // basic support

    // This URL starts session
    // Expects a JSON of this form: { email: 'dummie@foo.bar', password: '123' }
    // Returns a JSON of this form: { hasErrors: false, messages: [] }
    // in that JSON hasErrors is a boolean that states if there was an error
    // and messages is an array of string that has either error messages
    // or a message saying that the operation was successful
    app.post('/api/login/', userController.login);                                          // basic support

    // This URL ends the session of a user
    // Expects nothing
    // Returns a JSON of this form: { hasErrors: false, messages: [] }
    // in that JSON hasErrors is a boolean that states if there was an error
    // and messages is an array of string that has either error messages
    // or a message saying that the operation was successful
    app.post('/api/logout', checkSessionBeforeExec(userController.logout) );                // basic support

    // This URL ends the session of a user
    // Expects nothing
    // Returns a JSON of this form: { piDesc: 'piDescriptionString' }
    // in that JSON hasErrors is a boolean that states if there was an error
    // and messages is an array of string that has either error messages
    // or a message saying that the operation was successful
    app.post('/api/customer/genpicode', checkSessionBeforeExec(userController.genPiCode) ); // basic support

    // This URL ends the session of a user
    // Expects nothing
    // Returns a JSON of this form [ { "stypeid": 1, "stypedesc": "Temperature" }, { "stypeid": 2, "stypedesc": "Motion" } ]
    app.get('/api/sensor/get/types', sensorController.getSensorTypes);


    // This URL return the collection of all the data for an specific sensor
    // Expect a number with the sensor code at the end of the url
    // Returns a JSON of this form hasErrors: false, messages: [0], data: [ { sdatavalue: "12", sdatarecordeddate: "2014-04-07T21:50:52.974Z" }, { sdatavalue: "21", sdatarecordeddate: "2014-04-07T21:50:52.974Z" } ] }
    app.get('/api/get/temperature/data/:sensorId', sensorController.getTemperatureData);

   // TODO implement app.get('/api/customer/get/summary/data', );
}

