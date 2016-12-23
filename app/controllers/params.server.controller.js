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
            console.log(err);
            return next(err);
            //case param not found, add as open
        } else if (!param) {
            var p = new Param({"name": "users", isOpen: true});
            p.save(function (err) {
                if (err) {
                    console.log(err);
                    var message = getErrorMessage(err);
                    req.flash('error', message);
                    if (err.code === 11000) {
                        return res.status(409).json(err.code);
                    } else {
                        return res.status(500).json(err.code);
                    }
                } else {
                    next();
                }
            });
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
            } else if (User.isAdmin(user)) {
                next();
            } else {
                Param.findOne({name: "teams"}, function (err, param) {
                    if (err) {
                        console.log(err);
                        return next(err);
                    } else if (!param) {
                        var p = new Param({"name": "teams", isOpen: true});
                        p.save(function (err) {
                            if (err) {
                                console.log(err);
                                var message = getErrorMessage(err);
                                req.flash('error', message);
                                if (err.code === 11000) {
                                    return res.status(409).json(err.code);
                                } else {
                                    return res.status(500).json(err.code);
                                }
                            } else {
                                next();
                            }
                        });
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
                var p = new Param({"name": "teams", isOpen: true});
                p.save(function (err) {
                    if (err) {
                        console.log(err);
                        var message = getErrorMessage(err);
                        req.flash('error', message);
                        if (err.code === 11000) {
                            return res.status(409).json(err.code);
                        } else {
                            return res.status(500).json(err.code);
                        }
                    } else {
                        next();
                    }
                });
            } else if (!param.isOpen) {
                res.redirect('/');
            } else {
                next();
            }
        })
    }
};

