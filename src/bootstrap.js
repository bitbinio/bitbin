var bottle = require('bottlejs').pop('main');

module.exports = function() {
    bottle.factory('node.fs', function() { return require('fs'); });
    bottle.factory('glob', function() { return require('glob'); });
    bottle.register(require('md5-file-promise'));
    bottle.register(require('md5-transpose-list'));

    bottle.register(require(__dirname + '/adapter_injector'));
    bottle.register(require(__dirname + '/config'));
    bottle.register(require(__dirname + '/manifest'));
    bottle.register(require(__dirname + '/commands/init'));
    bottle.register(require(__dirname + '/commands/install'));
    bottle.register(require(__dirname + '/commands/publish'));

    // Add mkdirp as a callable on the fs dependency.
    bottle.decorator('node.fs', function(fs) {
        fs.mkdirp = require('mkdirp');
        return fs;
    });

    bottle.container.adapter_injector.inject();

    return bottle.container;
};
