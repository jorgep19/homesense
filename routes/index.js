var app = require('../app.js'),
    sensorController = require('./controller/SensorController.js'),
    userController = require('./controller/UserController.js');


var checkSessionBeforeExec = function(requestHandler) {

    return function(req, res) {

        console.log(req.session);
        if(!req.session.userID)
        {
            console.log('no session');
            res.send('You must login first');
        } else {
            console.log('going to the handler');
            requestHandler(req, res);
        }
    };
};

app.get('/', function(req, res){
    res.render('index', { title: 'Express' });
});

app.get('/login/:userCode', userController.login);

app.get('/logout', checkSessionBeforeExec(userController.logout) );

app.get('/dbtest', checkSessionBeforeExec(sensorController.getSensorTypes) );