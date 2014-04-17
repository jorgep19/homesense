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
    app.post('/login', webRequestController.login);

    // signup page
    app.get('/signup', webRequestController.loadSignup);
    app.post('/signup', webRequestController.signupUser);

    // dashboard
    app.get('/dashboard', checkSessionBeforeExec(webRequestController.loadDashboard) );

    // add pi
    app.get('/addpi', checkSessionBeforeExec(webRequestController.loadAppPi) );
    // { piName: 'mah pi', sensors: [ { sensorDesc: 'mah sensor', sensorType: '1' } ] }
    app.post('/addpi', checkSessionBeforeExec(webRequestController.addPiToLoggedInUser));
    app.get('/piadded', checkSessionBeforeExec(webRequestController.loadPiAdded));

    // temperature detail
    app.get('/sensor/Temperature/:sensorId', checkSessionBeforeExec(webRequestController.loadTemperatureDetail));

    // logout
    app.get('/logout', checkSessionBeforeExec(webRequestController.logout));

   // settings
   app.get('/settings', webRequestController.loadSettings);

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
    // Expects a JSON of this form: { "userId": 1, "sensors" : [ { "sensorId": 1, "value": 12, "date": "2014-04-07 17:50:52.9741"}, { "sensorId": 1, "value": 19, "date": "2014-04-07 17:50:52.9741"} ] }
    // Returns a log of the transaction that got executed
    app.post('/api/sensor/put/data', sensorController.recordSensorReadings);                // basic support


    // This URL provides an update for the pi sensors
    // Expects a JSON of this form: { piId: 21, userId: 19 }
    // Returns a JSON of this form: { hasErrors: false, messages: [], sensors: [ { sensid: 1, stypeid: 1, sensdesc: "Garage_Temp" }, { sensid: 1, stypeid: 1, sensdesc: "Garage_Temp" } ] }
    app.post('/api/pi/update',  piController.getSensorUpdate);                             //  basic support

    // CLIENTS API ROUTES
    // -------------------------------------------------------------------------------------
    // This URL creates a user account if possible
    // Expects a JSON of this form: { email: 'dummie@foo.bar', password: '123', passwordRetype: '123', phone: 7869706084 }
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
    app.post('/api/login', apiRequestController.login);                                          // basic support

    // This URL ends the session of a user
    // Expects nothing
    // Returns a JSON of this form: { hasErrors: false, messages: [] }
    // in that JSON hasErrors is a boolean that states if there was an error
    // and messages is an array of string that has either error messages
    // or a message saying that the operation was successful
    app.post('/api/logout', checkSessionBeforeExec(userController.logout) );                // basic support

    // This URL ends the session of a user
    // Expects a JSON of this form: { userId: 19 }
    // Returns a JSON of this form: {
    //    "hasErrors": false,
    //        "messages": [ "Data successfully retrieved for user:1" ],
    //        "data": [
    //        {
    //            "id": 1,
    //            "desc": "Garage_PI",
    //            "active": true,
    //            "sensorsReadings": [
    //                {
    //                    "id": 1,
    //                    "desc": "Garage_Temp",
    //                    "type": "Temperature",
    //                    "value": "20",
    //                    "timestamp": "2014-04-11T21:50:52.974Z"
    //                },
    //                {
    //                    "id": 40,
    //                    "desc": "other sensor",
    //                    "type": "Motion",
    //                    "value": "12",
    //                    "timestamp": "2014-04-16T18:57:02.759Z"
    //                }
    //            ]
    //        },
    //        {
    //            "id": 1,
    //            "desc": "Office pi",
    //            "active": true,
    //            "sensorsReadings": [
    //                {
    //                    "id": 40,
    //                    "desc": "other sensor",
    //                    "type": "Motion",
    //                    "value": "12",
    //                    "timestamp": "2014-04-16T18:57:02.759Z"
    //                }
    //            ]
    //        }
    //
    //    ]
    //}
    // in that JSON hasErrors is a boolean that states if there was an error
    // and messages is an array of string that has either error messages
    // or a message saying that the operation was successful
    app.post('/api/customer/get/summary/data', checkSessionBeforeExec(apiRequestController.getUserDataSummary) );       //basic support

    // This URL ends the session of a user
    // Expects nothing
    // Returns a JSON of this form: { piName: 'mah pi', sensors: [ { sensorDesc: 'mah sensor', sensorType: '1' } ] }
    // in that JSON hasErrors is a boolean that states if there was an error
    // and messages is an array of string that has either error messages
    // or a message saying that the operation was successful and data
    // { piDesc: 'pi name', piCode: 70, sensors: [ { sensorDesc: 'sensorName', sensorType: 'Temperature' }, { sensorDesc: 'sensorName', sensorType: 'Motion' } ] }
    app.post('/api/customer/genpicode', checkSessionBeforeExec(apiRequestController.registerPi) );

    // This URL ends the session of a user
    // Expects nothing
    // Returns a JSON of this form [ { "stypeid": 1, "stypedesc": "Temperature" }, { "stypeid": 2, "stypedesc": "Motion" } ]
    app.get('/api/sensor/get/types', sensorController.getSensorTypes);                      // fully supported


    // This URL return the collection of all the data for an specific sensor
    // Expect a number with the sensor code at the end of the url
    // Returns a JSON of this form hasErrors: false, messages: [0], data: [ { sdatavalue: "12", sdatarecordeddate: "2014-04-07T21:50:52.974Z" }, { sdatavalue: "21", sdatarecordeddate: "2014-04-07T21:50:52.974Z" } ] }
    app.get('/api/get/temperature/data/:sensorId', sensorController.getTemperatureData);
}

