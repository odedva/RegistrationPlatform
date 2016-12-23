var users = require('../../app/controllers/users.server.controller'),
    params = require('../../app/controllers/params.server.controller'),
    passport = require('passport');

module.exports = function (app) {
    app.route('/users')
        .post(users.permissionCheck, params.isRegistrationOpen, users.create)
        .get(users.permissionCheck, users.list);

    app.route('/users/:userId')
        .get(users.logedIn, users.read)
        .put(users.permissionCheck, users.update)
        .delete(users.permissionCheck, users.delete);
    app.param('userId', users.userByID);

    app.route("/resetme")
        .put(params.isRegistrationOpen, users.passer);
    app.route('/register')
        .get(params.isRegistrationOpen, users.renderRegister)
        .post(params.isRegistrationOpen, users.register);

    app.route('/forgot').get(params.isRegistrationOpen, users.renderForgot).
        post(params.isRegistrationOpen, users.forgot);

    app.route('/resetme/:resetId').get(params.isRegistrationOpen, users.renderResetme);
    app.route('/printUsers').get(users.permissionCheck, users.renderPrintUsers);

    app.route('/login')
        .get(users.renderLogin)
        .post(passport.authenticate('local', {
            successRedirect: '/team-up',
            failureRedirect: '/login',
            failureFlash: true
        }));

    app.route('/rsvp/:userIdToUpdate').get(users.userAgree);

    app.route('/reset').get(users.permissionCheck, users.renderReset);

    app.get('/logout', users.logout);

    app.post('/contactus', users.sendMail)
};