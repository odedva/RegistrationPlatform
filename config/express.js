var config = require('./config'),
    express = require('express'),
    bodyParser = require('body-parser'),
    passport = require('passport'),
    flash = require('connect-flash'),
    session = require('express-session'),
    helmet = require('helmet');

module.exports = function () {
    var app = express();

    app.use(bodyParser.urlencoded({
        extended: true
    }));

    app.use(bodyParser.json());

    app.use(session({
        saveUninitialized: true,
        resave: true,
        secret: 'OhSnapThisIsABigSecret'
    }));

    app.set('views', './app/views');
    app.set('view engine', 'ejs');

    app.use(flash());
    app.use(passport.initialize());
    app.use(passport.session());
    app.use(helmet());
    require('../app/routes/index.server.routes.js')(app);
    require('../app/routes/users.server.routes.js')(app);
    require('../app/routes/teams.server.routes.js')(app);
    require('../app/routes/params.server.routes.js')(app);

    app.use(express.static('./public'));

    app.use(function (err, req, res, next) {
        console.error(err.stack);
        res.status(500).send('This is a 500! Are you sure that you really wanted this? if yes - contact us at ' + config.supportEmailAddr + '. if no, please start again :)');
    });
    return app;
};