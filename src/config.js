var cachedConfig;

var retrieveConfig = function() {
    if (cachedConfig) {
        return cachedConfig;
    }
    return cachedConfig = require(__dirname + '/../badassets.json');
};

module.exports = function() {
    return Object.create({
        retrieve: retrieveConfig
    });
};
module.exports.$name = 'config';
module.exports.$type = 'factory';
