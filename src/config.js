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

};

module.exports = Config;
module.exports.$name = 'config';
module.exports.$inject = ['node_fs'];
