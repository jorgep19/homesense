var express = require('express'),
    http = require('http'),
    cors = require('cors'),
    flash = require('connect-flash'),
    routes = require('./routes/index.js');

var app = express();


app.configure(function() {
    // Generate pretty html from jade templates
    app.locals.pretty = true;

    app.set('port', process.env.PORT || 5000);
    app.set('views', __dirname + '/views');
    app.set('view engine', 'jade');

    app.use(cors());
    app.use(express.logger('dev'));
    app.use(express.bodyParser());
    app.use(express.cookieParser());
    app.use(express.session( { secret: 'HomeSenseCode..shhh'} ));
    app.use(flash());
    app.use(app.router);
    app.use(express.static(__dirname + '/public' ) );

    // this will be the 404 middle ware because is at the end when nothing matches the url
    app.use(function (req, res) {
        console.log(req.url);
        res.send(404, 'nope.... 404')
    });
});

routes(app);

var server = app.listen(app.get('port'), function() {
    console.log('Express server listening on port ' + server.address().port);
});
