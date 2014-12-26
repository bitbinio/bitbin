var util = require('util');
var BaseAdapter = require(__dirname + '/../base_adapter');

var LocalAdapter = function(fs) {
    this.fs = fs;
}

util.inherits(LocalAdapter, BaseAdapter);

module.exports = function(container) {
    return new LocalAdapter(container.node.fs);
};
