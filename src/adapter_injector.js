// @todo adapt this to a file checker on an adapter folder.
var BaseAdapter = require('./base_adapter');
var builtIn = [
    'bitbin-local'
];

var isValidAdapterInterface = function(adapter) {
    var baseMethods = Object.keys(BaseAdapter.prototype);
    var compare = baseMethods.filter(function(method) {
        return typeof adapter[method] === 'function';
    });
    return baseMethods.length === compare.length;
};

var AdapterInjector = function(config) {
    this.config = config;
};

AdapterInjector.prototype.builtIn = function() {
    return builtIn;
};

AdapterInjector.prototype.inject = function() {
    var config = this.config.retrieve();
    var adapter = config.adapter;
    var bottle = require('bottlejs').pop('main');
    var adapterImpl;
    if (!config.isDefault && !adapter) {
        console.error('No upload adapter defined.');
        process.exit(1);
    }
    try {
        adapterImpl = require(adapter);
        bottle.factory('adapter', adapterImpl);
        bottle.decorator('adapter', function(adapter) {
            if (!isValidAdapterInterface(adapter)) {
                console.error('Adapter must be an instance of base_adapter.');
                process.exit(1);
            }
            return adapter;
        });
    } catch(e) {
        bottle.factory('adapter', function() {
            return function() {
                console.error('Invalid adapter [%s]', adapter);
            };
        });
    }
};

module.exports = AdapterInjector;
module.exports.$name = 'adapter_injector';
module.exports.$inject = ['config'];
