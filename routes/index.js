var app = require('../app.js'),
    pg = require('pg');

app.get('/', function(req, res){
    res.render('index', { title: 'Express' });
});

app.get('/dbtest', function(req, res){

    pg.connect( process.env.DATABASE_URL, function(err, client, done) {
        client.query('SELECT * FROM sensor_type;', function(err, result) {
            done();

            if(err) return console.error(err);

            res.json(result.rows);
        });
    });
});