var bottle = require('bottlejs')();

module.exports = function() {
    bottle.register(require(__dirname + '/config'));
    bottle.register(require(__dirname + '/manifest'));
	bottle.register(require(__dirname + '/md5'));
	bottle.register(require(__dirname + '/commands/publish'));

	return bottle.container;
};
