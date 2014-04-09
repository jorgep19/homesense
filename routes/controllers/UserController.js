var constructor = function() {

    var userControllerInstance = {};
    var userDA = require('../dataAccessors/UserDataAccessor.js')

    // method for creating a user account
    userControllerInstance.registerUser = function (req, res) {

        var data = req.body;
        var response = { hasErrors: false, messages: [] };

        // TODO fully implement this validations
        if(data.email.length === 0)
        {
            response.hasErrors = true;
            response.messages.push("Email is required");
        }

        // TODO fully implement this validations
        if(data.password.length === 0)
        {
            response.hasErrors = true;
            response.messages.push("Password is required");
        }

        if(!response.hasErrors)
        {
            userDA.insertUserToDb(data, response, function(err, response, result)
            {
                console.log(err);

                if(err && err.code == 23505)
                {
                    response.hasErrors = true;
                    response.messages.push("An account for " + data.email + " already exists");

                    console.log(response);
                }
                else if(err)
                {
                    response.hasErrors = true;
                    console.log(err);
                    response.messages.push("something went wrong");
                }
                else
                {
                    response.messages.push("Account for " + data.email + "successfully created");
                }


                res.send(response);
            });
        }
        else
        {
            res.send(response);
        }
    };

    userControllerInstance.login = function(req, res){
        var response = { hasErrors: false, messages: [] };
        var data = req.body;

        // TODO fully implement this validations
        if(data.email.length === 0)
        {
            response.hasErrors = true;
            response.messages.push("Email is required");
        }

        // TODO fully implement this validations
        if(data.password.length === 0)
        {
            response.hasErrors = true;
            response.messages.push("Password is required");
        }

        if(!response.hasErrors) {

            userDA.authenticateCustomer(data, res, function(err, rows){

                if (rows.length != 0) {
                    console.log(rows[0].cusid);

                    req.session.regenerate(function(){
                        console.log(rows[0].cusid);
                        req.session.userCode = rows[0].cusid;
                    });

                    console.log(req.session);
                    response.hasErrors = false;
                    response.messages.push("Logged in as " + data.email);
                } else {
                    response.hasErrors = true;
                    response.messages.push("Didn't find account for " + data.email);
                }

                res.send(response);
            });
        } else {
            res.send(response);
        }
    };

    userControllerInstance.logout = function(req, res){
        delete req.session.userID;

        res.send( { hasErrors: false, messages: ['successfully logged out'] });
    };

    return userControllerInstance;
};

module.exports = constructor();