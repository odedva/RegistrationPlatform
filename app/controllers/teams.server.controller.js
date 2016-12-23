Array.prototype.diff = function (a) {
    return this.filter(function (i) {
        return a.indexOf(i) < 0;
    });
};

function uniq(a) {
    var seen = {};
    return a.filter(function (item) {
        return seen.hasOwnProperty(item) ? false : (seen[item] = true);
    });
}

var Team = require('mongoose').model('Team'),
    User = require('mongoose').model('User'),
    Param = require('mongoose').model('Param'),
    passport = require('passport'),
    async = require("async"),
    config = require('../../config/config');

var getErrorMessage = function (err) {
    var message = '';
    if (err.code) {
        switch (err.code) {
            case 11000:
            case 11001:
                message = 'Team already exists';
                break;
            default:
                message = 'Something went wrong';
        }
    }
    else {
        for (var errName in err.errors) {
            if (err.errors[errName].message)
                message = err.errors[errName].message;
        }
    }

    return message;
};

var memberChange = {
    noAction: 0,
    addMember: 1,
    removeMember: 2,
    maxSize: 5
};


exports.createTeamPage = function (req, res, next) {
    if (req.user && !req.user.isMember) {
        res.render('createTeam', {
            user: req.user,
            suppemail: config.supportEmailAddr,
            eventname: config.eventname,
            eventwebsite: config.eventwebsite,
            eventfacebook: config.eventfacebook,
            maxusers: config.maxNumOfUsersInTeam
        });
    } else {
        return res.redirect('/team-up');
    }
};

exports.createMyTeamPage = function (req, res, next) {
    if (req.user && req.user.isMember) {
        Team.findOne({_id: req.user.team}, function (err, team) {
            if (err) {
                return res.redirect('/team-up');
            }
            else {
                var index = team.members.indexOf(team.admin_email);
                team.members.splice(index, 1);
                return res.render('myTeam', {
                    user: req.user,
                    team: team,
                    suppemail: config.supportEmailAddr,
                    eventname: config.eventname,
                    eventwebsite: config.eventwebsite,
                    eventfacebook: config.eventfacebook
                });
            }
        });
    } else {
        return res.redirect('/team-up');
    }
};

exports.createUpdateTeamPage = function (req, res, next) {
    if (req.user && req.user.isMember) {
        Team.findOne({_id: req.user.team}, function (err, team) {
            if (err) {
                return res.redirect('/team-up');
            }
            else if (req.user.email !== team.admin_email) {
                return res.redirect('/myTeam');
            } else {
                var index = team.members.indexOf(team.admin_email);
                team.members.splice(index, 1);
                return res.render('updateTeam', {
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
        return res.redirect('/team-up');
    }
};


exports.create = function (req, res, next) {
    var team = new Team(req.body);
    team.save(function (err, savedTeam) {
        if (err) {
            //at team has this email admin already. very rare error if user deleted from mongo withoug deleting his team
            if (err.code === 11000) {
                res.status(403).json({
                    code: 12,
                    status: "Sorry for that, we have an internal error. it's this funny error. please contact " + config.supportEmailAddr
                })

            }
            console.log(err)

            return next(err);
        }
        else {
            User.findOneAndUpdate({email: team.admin_email}, {isMember: true, team: team._id}, function (err, user) {
                if (err) {
                    return next(err);
                } else {
                    req.newTeam = savedTeam;
                    next();
                }
            });
        }
    });
};
exports.updateNewTeamMembers = function (req, res, next) {
    if (req.body.members.length > 0) {
        async.each(req.body.members, function (member, endQueryNotify) {
                User.update({email: {$regex: new RegExp(member, "i")}}, {
                    team: req.newTeam._id,
                    isMember: true
                }, {multi: true}, function (err, raw) {
                    if (err) {
                        endQueryNotify(err);
                    } else {
                        endQueryNotify();
                    }
                })
            },
            function (err) {
                if (!err) {
                    res.json(req.newTeam);
                } else {
                    res.status(403).json({status: err});
                }
            });
    }
};


exports.verifyUserPermissionOnCDTeam = function (req, res, next) {
    if (req.user.email !== req.body.admin_email) {
        res.status(403).json({code: 8, status: "user must be admin of team to create or delete a team"})
    } else {
        next();
    }
};

exports.verifyUserPermissionOnUpdateTeam = function (req, res, next) {
    if (req.body.members.indexOf(req.user.email) === -1) {
        res.status(403).json({code: 9, status: "user must be part of the team to update it"})
    } else {
        next();
    }
};

exports.preVerifyTeamCreate = function (req, res, next) {
    User.findOne({email: req.body.admin_email}, function (err, user) {
        if (err) {
            return next(err);
        } else if (!user) {
            res.status(403).json({code: 6, status: "couldn't find admin user for this team"});
        } else if (user.isMember) {
            res.status(403).json({code: 7, status: "this user is already a member of a team"})
        } else {
            next();
        }

    })
};

exports.list = function (req, res, next) {
    Team.find({}, function (err, teams) {
        if (err) {
            return next(err);
        }
        else {
            res.json(teams);
        }
    });
};

exports.read = function (req, res) {
    res.json(req.team);
};

exports.teamByID = function (req, res, next, id) {
    Team.findOne({_id: id}, function (err, team) {
        if (err) {
            return next(err);
        }
        else {
            req.team = team;
            next();
        }
    });
};

exports.update = function (req, res, next) {
    Team.findByIdAndUpdate(req.team._id, req.body, {new: true}, function (err, team) {
        if (err) {
            return next(err);
        }
        else {
            next();
        }
    });
};

exports.updateUserMembership = function (req, res, next) {
    //update user with member relation
    var query = {team: req.team._id};
    User.update(query, {isMember: false, team: ""}, {multi: true}, function (err, numAffected) {
        if (err) {
            return next(err);
        }
        else {
            async.each(req.body.members, function (member, endQueryNotify) {
                    User.update({email: {$regex: new RegExp(member, "i")}}, {
                        team: req.team._id,
                        isMember: true
                    }, {multi: true}, function (err, raw) {
                        if (err) {
                            endQueryNotify(err);
                        } else {
                            endQueryNotify();
                        }
                    })
                },
                function (err) {
                    if (!err) {
                        res.json({status: 'good'});
                    } else {
                        res.status(403).json({status: err});
                    }
                });
        }
    })
};

endQueryNotify = function (errorString) {
    if (!errorString) {
        console.log(errorString);
    } else {
        console.log("query ended");
    }
};

exports.preVerifyNewTeamMembers = function (req, res, next) {
    req.body.members = uniq(req.body.members);
    var new_members = req.body.members;
    if (req.team) {
        new_members = req.body.members.diff(req.team.members);

    }

    if (req.body.members.length > config.maxNumOfUsersInTeam) {
        res.json("team cannot have more than " + config.maxNumOfUsersInTeam + " members including the team admin");
    } else {
        async.each(new_members, function (member, endQueryNotify) {
                User.findOne({email: {$regex: new RegExp(member, "i")}}, function (err, user) {
                    if (err) {
                        endQueryNotify(err);
                    } else if (!user) {
                        endQueryNotify("couldn't find new members email (" + member + ") in list");

                    }
                    else if (user.isMember) {
                        endQueryNotify(member + " already a member of a team");
                    } else {
                        endQueryNotify();
                    }
                })
            },
            function (err) {
                if (!err) {
                    next()
                } else {
                    res.status(403).json({status: err});
                }
            });
    }
};

exports.preVerifyNewMember = function (req, res, next) {
    if (req.body.memberChange === memberChange.addMember) {
        User.findOne({email: {$regex: new RegExp(req.body.changedMember, "i")}}, function (err, user) {
            if (err) {
                return next(err);
            } else if (!user) {
                res.status(403).json({code: 1, status: "couldn't find member in list"});
            }
            else if (user.isMember) {
                res.status(403).json({code: 3, status: "already a member of a team"})
            } else {
                next();
            }

        })
    } else if (req.body.memberChange === memberChange.removeMember) {
        User.findOne({email: req.body.changedMember}, function (err, user) {
            if (err) {
                return next(err);
            } else if (!user) {
                res.status(403).json({code: 1, status: "couldn't find member in list"})
            } else if (!user.isMember) {
                res.status(403).json({code: 4, status: "this user is not a member of a team"})
            } else {
                next();
            }

        })
    } else {
        next();
    }

};

exports.preVerifyNewTeam = function (req, res, next) {
    if (req.body.memberChange === memberChange.addMember) {
        Team.findOne({admin_email: req.team.admin_email}, function (err, team) {
            if (err) {
                return next(err);
            } else if (!team) {
                res.status(403).json({code: 7, status: "couldn't find updated team in list (probably removed)"})
            } else if (team.members.length === memberChange.maxSize) {
                res.status(403).json({code: 5, status: "team size is 5 (maximum) already"});
            } else {
                next();
            }
        })
    } else {
        next();
    }

};
/**
 * upon delete of a team, first update the users which are part of this team with no-team details
 */
exports.updateRelatedMembers = function (req, res, next) {
    if (req.team.members.length > 0) {
        User.update({team: req.team._id}, {team: '', isMember: false}, {multi: true}, function (err, raw) {
            if (err) {
                return next(err);
            } else {
                next();
            }
        })
    } else {
        next();
    }
};


exports.delete = function (req, res, next) {
    req.team.remove(function (err) {
        if (err) {
            return next(err);
        }
        else {

            res.json(req.team);
        }
    })
};

exports.logedIn = function loggedIn(req, res, next) {
    if (req.user) {
        next();
    } else {
        res.redirect('/login');
    }
};

