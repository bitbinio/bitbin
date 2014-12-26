// @todo adapt this to a file checker on an adapter folder.
var BaseAdapter = require('./base_adapter');
var builtIn = [
    'S3',
    'local'
];

var AdapterInjector = function(config) {
    this.config = config;
};

AdapterInjector.prototype.inject = function() {
    var config = this.config.retrieve();
    var adapter = config.adapter;
    var bottle = require('bottlejs').pop('main');
    var adapterImpl;
    var path = builtIn.indexOf(adapter) >= 0 ?
        __dirname + '/adapters/' + adapter :
        adapter;
    if (!config.isDefault && !adapter) {
        console.error('No upload adapter defined.');
        process.exit(1);
    }
    try {
        adapterImpl = require(path);
        bottle.factory('adapter', adapterImpl);
        bottle.decorator('adapter', function(adapter) {
            if (!(adapter instanceof BaseAdapter)) {
                console.error('Adapter must be an instance of base_adapter.');
                process.exit(1);
            }
            return adapter;
        });
    } catch(e) {
        bottle.factory('adapter', function() {
            return function() {
                console.error('Invalid adapter [%s]', path);
            };
        });
    }
};

module.exports = AdapterInjector;
module.exports.$name = 'adapter_injector';
module.exports.$inject = ['config'];
