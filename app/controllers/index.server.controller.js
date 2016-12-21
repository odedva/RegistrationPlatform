var Team = require('mongoose').model('Team');
var Param = require('mongoose').model('Param'),
    config = require('../../config/config');

/**
 * This method renders
 * @param req
 * @param res
 */
exports.render = function (req, res) {
    if (req.user) {
        if (req.user.isMember) {
            Team.findOne({_id: req.user.team}, function (err, team) {
                if (err) {
                    res.render('index', {
                        user: req.user,
                        suppemail: config.supportEmailAddr,
                        eventname: config.eventname,
                        eventwebsite: config.eventwebsite,
                        eventfacebook: config.eventfacebook,
                        maxusers: config.maxNumOfUsersInTeam
                    });
                } else {
                    var index = team.members.indexOf(team.admin_email);
                    team.members.splice(index, 1);
                    res.render('index', {
                        user: req.user,
                        team: team,
                        suppemail: config.supportEmailAddr,
                        eventname: config.eventname,
                        eventwebsite: config.eventwebsite,
                        eventfacebook: config.eventfacebook,
                        maxusers: config.maxNumOfUsersInTeam
                    });
                }
            });
        } else {
            res.render('index', {
                user: req.user,
                suppemail: config.supportEmailAddr,
                eventname: config.eventname,
                eventwebsite: config.eventwebsite,
                eventfacebook: config.eventfacebook,
                maxusers: config.maxNumOfUsersInTeam
            });
        }
    } else {
        res.render('index', {
            user: '',
            messages: req.flash('error'),
            suppemail: config.supportEmailAddr,
            eventname: config.eventname,
            eventwebsite: config.eventwebsite,
            eventfacebook: config.eventfacebook,
            maxusers: config.maxNumOfUsersInTeam
        })
    }

};
exports.renderMingle = function (req, res) {
    if (req.user) {
        Team.find({isClosed: false}, function (err, teams) {
            shuffle(teams);
            res.render('mingle', {
                user: req.user,
                teams: teams,
                suppemail: config.supportEmailAddr,
                eventname: config.eventname,
                eventwebsite: config.eventwebsite,
                eventfacebook: config.eventfacebook
            });
        });
    } else {
        return res.redirect('/team-up');
    }

};

exports.isTimerOn = function (req, res, next) {
    Param.find({name: "timer"}, function (err, param) {
        if (err) {
            return next(err);
        } else if (!param) {
            res.status(403).send("close")
        } else if (!param.isOpen) {
            res.status(200).send("close")
        } else {
            res.status(200).send("on")
        }
    })
};

/**
 * Shuffles array in place.
 * @param {Array} a items The array containing the items.
 */
function shuffle(a) {
    var j, x, i;
    for (i = a.length; i; i -= 1) {
        j = Math.floor(Math.random() * i);
        x = a[i - 1];
        a[i - 1] = a[j];
        a[j] = x;
    }
}