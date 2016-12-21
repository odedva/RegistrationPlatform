module.exports = function (app) {
    var index = require('../controllers/index.server.controller'),
        params = require('../../app/controllers/params.server.controller');
    app.get('/team-up', params.isTeamsOpen, index.render);
    app.get('/', index.render);
    app.get('/mingle', params.isTeamsOpen, index.renderMingle);

};