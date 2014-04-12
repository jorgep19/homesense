var constructor = function() {

    var userControllerInstance = {};
    var userDA = require('../dataAccessors/UserDataAccessor.js');

    // Creates the user account
    userControllerInstance.signupUser = function (data, result, responseHandler) {

        // TODO fully implement this validations
        if(data.email && data.email.length === 0)
        {
            result.hasErrors = true;
            result.messages.push("Email is required");
        }

        // TODO fully implement this validations
        if(data.password && data.password.length === 0)
        {
            result.hasErrors = true;
            result.messages.push("Password is required");
        }

        if(data.password !== data.passwordRetype){
            result.hasErrors = true;
            result.messages.push("Password and retype don't match");
        }

        if(!result.hasErrors) {
            userDA.registerUser(data, function(err, userId) {

                if(err && err.code == 23505)
                {
                    result.hasErrors = true;
                    result.messages.push("An account for " + data.email + " already exists");
                } else if(err) {
                    result.hasErrors = true;
                    result.messages.push("something went wrong");
                } else {
                    result.messages.push("Account for " + data.email + "successfully created");
                    result.userId = userId;
                }

                responseHandler(result);
            });
        } else {
            responseHandler(result);
        }
    };

    // Starts the session for given user
    userControllerInstance.login = function(data, result, responseHandler){
        // TODO fully implement this validations
        if(data.email.length === 0)
        {
            result.hasErrors = true;
            result.messages.push("Email is required");
        }

        // TODO fully implement this validations
        if(data.password.length === 0)
        {
            result.hasErrors = true;
            result.messages.push("Password is required");
        }

        if(!result.hasErrors) {

            userDA.authenticateUser(data, function(err, rows){

                if (rows.length != 0) {
                    result.userId = rows[0].cusid;
                    result.hasErrors = false;
                    result.messages.push("Logged in as " + data.email);
                } else {
                    result.hasErrors = true;
                    result.messages.push("Didn't find account for " + data.email);
                }

                responseHandler(result);
            });
        } else {
            responseHandler(result);
        }
    };

    // Ends the session for a given user
    userControllerInstance.logout = function(req, res){
        delete req.session.userCode;

        res.json( { hasErrors: false, messages: ['successfully logged out'] });
    };

    // Adds an unverified pi to the user logged in.
    // It return the pi code fo the user can go an input it in the pi
    // through the command line interface.
    userControllerInstance.genPiCode = function(req, res) {

        userDA.registerPi(req.body, req.session.userCode, function(err, piDesc) {
            if(err) {
                res.json( { hasErrors: true, messages: "couldn't register PI" + piDesc } );
            } else {
                res.json( { hasErrors: false, piDesc: piDesc } );
            }
        })
    }

    return userControllerInstance;
};

module.exports = constructor();