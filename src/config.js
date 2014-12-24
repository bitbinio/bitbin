var Q = require('q');
var cachedConfig;

var Config = function(fs) {
    this.fs = fs;
};

Config.prototype.retrieve = function() {
    if (cachedConfig) {
        return cachedConfig;
    }
    return cachedConfig = JSON.parse(this.fs.readFileSync(process.cwd() + '/badassets.json'));
};

Config.prototype.write = function(config) {
    return Q.nfcall(this.fs.writeFile, process.cwd() + '/badassets.json', JSON.stringify(config, null, 4));
};

module.exports = Config;
module.exports.$name = 'config';
module.exports.$inject = ['node_fs'];
