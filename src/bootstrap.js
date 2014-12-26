var bottle = require('bottlejs').pop('main');

module.exports = function() {
    bottle.factory('node.fs', function() { return require('fs'); });
    bottle.factory('glob', function() { return require('glob'); });

    bottle.register(require(__dirname + '/adapter_injector'));
    bottle.register(require(__dirname + '/config'));
    bottle.register(require(__dirname + '/manifest'));
    bottle.register(require(__dirname + '/md5'));
    bottle.register(require(__dirname + '/commands/init'));
    bottle.register(require(__dirname + '/commands/publish'));

    bottle.container.adapter_injector.inject();

    return bottle.container;
};
