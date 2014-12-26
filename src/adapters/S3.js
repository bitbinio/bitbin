var util = require('util');
var BaseAdapter = require(__dirname + '/../base_adapter');

var S3Adapter = function(fs) {
    this.fs = fs;
}

util.inherits(S3Adapter, BaseAdapter);

module.exports = function() {
    return new S3Adapter();
};
