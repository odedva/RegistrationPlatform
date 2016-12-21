var users = require('../../app/controllers/users.server.controller'),
    params = require('../../app/controllers/params.server.controller'),
    passport = require('passport');

module.exports = function (app) {
    app.route('/params').get(users.permissionCheck, users.renderParams);
    app.route('/params/:paramId').put(users.permissionCheck, users.updateParam);

};