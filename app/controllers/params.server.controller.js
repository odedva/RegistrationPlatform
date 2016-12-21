var Param = require('mongoose').model('Param'),
    User = require('mongoose').model('User'),
    config = require('../../config/config');

exports.renderParams = function (req, res, next) {
    Param.find({}, function (err, params) {
        if (err) {
            return next(err);
        }
        else {
            res.render('params', {
                title: 'Manage Parameters',
                params: params,
                suppemail: config.supportEmailAddr,
                eventname: config.eventname,
                eventwebsite: config.eventwebsite,
                eventfacebook: config.eventfacebook
            });
        }
    });
};

exports.isRegistrationOpen = function (req, res, next) {
    Param.findOne({name: "users"}, function (err, param) {
        if (err) {
            return next(err);
        } else if (!param) {
            res.status(403).json({
                code: 14,
                status: "we have a general error, code 14. please contact " + config.supportEmailAddr
            })
        } else if (!param.isOpen) {
            res.redirect('/');
        } else {
            next();
        }
    })
};

exports.isTeamsOpen = function (req, res, next) {
    if (req.user) {
        User.findById(req.user._id, function (err, user) {
            if (err) {
                return next(err);
            } else if (user.isAdmin) {
                next();
            } else {
                Param.findOne({name: "teams"}, function (err, param) {
                    if (err) {
                        return next(err);
                    } else if (!param) {
                        res.status(403).json({
                            code: 12,
                            status: "we have a general error, code 12. please contact " + config.supportEmailAddr
                        })
                    } else if (!param.isOpen) {
                        res.status(403).send("<h1>Team Platform is currently closed</h1>");
                    } else {
                        next();
                    }
                })
            }
        })
    } else {
        Param.findOne({name: "teams"}, function (err, param) {
            if (err) {
                return next(err);
            } else if (!param) {
                res.status(403).json({
                    code: 12,
                    status: "we have a general error, code 12. please contact " + config.supportEmailAddr
                })
            } else if (!param.isOpen) {
                res.redirect('/');
            } else {
                next();
            }
        })
    }
};

