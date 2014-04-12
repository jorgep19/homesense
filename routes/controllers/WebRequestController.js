var constructor = function() {

    var webRequestControllerInstance = {};
    var userController = require('./UserController.js');
    var piController = require('./PiController.js');
    var sensorController = require('./SensorController.js');

    webRequestControllerInstance.loadHomePage = function(req, res){
        res.render('index', { data: req.flash('info') });
    };

    webRequestControllerInstance.loadSignup = function(req, res){

        var data = { hasErrors: (req.flash('signup-has-erros').length !== 0),  messages: req.flash('signup-messages') };
        console.log(data);

        res.render('signup', { data: data } );
    };
    webRequestControllerInstance.signupUser = function(req, res){
        var result = { hasErrors: false, messages: [] };

        userController.signupUser(req.body, result, function(responseResult){

            if(responseResult.hasErrors) {
                req.flash('signup-has-erros', 'there are errors');
                req.flash('signup-messages', responseResult.messages);
                webRequestControllerInstance.loadSignup(req, res);
            } else {
                req.session.userId = responseResult.userId;
                res.redirect('/dashboard');
            }
        });
    };

    webRequestControllerInstance.loadDashboard = function(req, res){
        console.log('about to load the dashboard for:' + req.session.userId);
        res.render('dashboard');
    };

    return webRequestControllerInstance;
};

module.exports = constructor();