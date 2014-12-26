var util = require('util');
var BaseAdapter = require(__dirname + '/../base_adapter');

var LocalAdapter = function(fs) {
    this.fs = fs;
}

util.inherits(LocalAdapter, BaseAdapter);

/**
 * Filter files already existing in the upstream.
 *
 * @param array files
 * @return array
 * @todo implement It is just passing through for now.
 */
LocalAdapter.prototype.filterExisting = function(files) {
    return files;
};

module.exports = function(container) {
    return new LocalAdapter(container.node.fs);
};
