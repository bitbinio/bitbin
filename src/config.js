var Q = require('q');
var cachedConfig;
var defaultConfig = {
    adapter: '',
    paths: [],
    isDefault: true
};

var Config = function(fs) {
    this.fs = fs;
};

Config.prototype.retrieve = function() {
    var config;
    if (cachedConfig) {
        return cachedConfig;
    }
    try {
        cachedConfig = JSON.parse(this.fs.readFileSync(process.cwd() + '/badassets.json'));
    } catch (e) {
        cachedConfig = defaultConfig;
    }
    return cachedConfig;
};

Config.prototype.write = function(config) {
    return Q.nfcall(this.fs.writeFile, process.cwd() + '/badassets.json', JSON.stringify(config, null, 4));
};

module.exports = Config;
module.exports.$name = 'config';
module.exports.$inject = ['node.fs'];
