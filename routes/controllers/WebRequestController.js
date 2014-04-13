var constructor = function() {

    var webRequestControllerInstance = {};
    var userController = require('./UserController.js');
    var piController = require('./PiController.js');
    var sensorController = require('./SensorController.js');

    // -----------------------------------------------------------------------------------------------------------------
    // Home page methods
    // -----------------------------------------------------------------------------------------------------------------

    // loads the home page... show errors if there were any with the login
    webRequestControllerInstance.loadHomePage = function(req, res){
        var data = { hasErrors: (req.flash('login-has-erros').length !== 0),  messages: req.flash('login-messages') };

        res.render('index', { data: data });
    };

    // manages a login request
    webRequestControllerInstance.login = function(req, res) {
        var result = { hasErrors: false, messages: [] };

        userController.login(req.body, result, function(responseResult){

            if(responseResult.hasErrors) {
                req.flash('login-has-erros', 'there are errors');
                req.flash('login-messages', responseResult.messages);
                res.redirect('/');
            } else {
                req.session.userId = responseResult.userId;
                res.redirect('/dashboard');
            }
        });
    }

    // -----------------------------------------------------------------------------------------------------------------
    // Sign up page methods
    // -----------------------------------------------------------------------------------------------------------------

    // load the sign up page and checks for errors
    webRequestControllerInstance.loadSignup = function(req, res){
        var data = { hasErrors: (req.flash('signup-has-erros').length !== 0),  messages: req.flash('signup-messages') };

        res.render('signup', { data: data } );
    };

    // manages the request to register a user... There might be errors depending on the user data
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

    // -----------------------------------------------------------------------------------------------------------------
    // Dashboard page methods
    // -----------------------------------------------------------------------------------------------------------------

    webRequestControllerInstance.loadDashboard = function(req, res){

        console.log('about to load the dashboard for:' + req.session.userId);
        res.render('dashboard');
    };

    // -----------------------------------------------------------------------------------------------------------------
    // Settings page methods
    // -----------------------------------------------------------------------------------------------------------------
    webRequestControllerInstance.loadSettings = function(req, res) {
        console.log('loading /settings page')
        res.render('settings')
    };

    // -----------------------------------------------------------------------------------------------------------------
    // User Menu methods
    // -----------------------------------------------------------------------------------------------------------------
    webRequestControllerInstance.logout = function(req, res){
        req.session.userId = undefined;
        res.redirect('/');
    };

    return webRequestControllerInstance;
};

module.exports = constructor();
