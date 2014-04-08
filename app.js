var express = require('express'),
    http = require('http'),
    cors = require('cors');

var app = express();


app.configure(function() {
    app.set('port', process.env.PORT || 5000);
    app.set('views', __dirname + '/views');
    app.set('view engine', 'jade');

    app.use(express.bodyParser());
    app.use(express.cookieParser());
    app.use(express.session( { secret: 'HomeSenseCode..shhh'} ));
    app.use(cors());
    app.use(app.router);
    app.use(express.static(__dirname + '/public' ) );

    // this will be the 404 middle ware because is at the end when nothing matches the url
    app.use(function (req, res) {
        res.send(404, 'nope.... 404')
    });
});

var server = app.listen(app.get('port'), function() {
    console.log('Express server listening on port ' + server.address().port);
});

module.exports = app;
