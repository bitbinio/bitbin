var junk = require('junk');
var Q = require('q');
var glob;

var Manifest = function(config, md5, globLib) {
    this.config = config;
    this.md5 = md5;
    glob = globLib || require('glob');
};

var filterJunk = function(files) {
    return files.filter(junk.not);
};

/**
 * Retrieve all files located in the configured paths.
 *
 * @return promise
 */
Manifest.prototype.localFiles = function() {
    var pathPromises = [];
    this.config.retrieve().paths.forEach(function(path) {
        pathPromises.push(Q.nfcall(glob, path, {nodir: true}).then(filterJunk));
    });
    return Q.all(pathPromises)
        // flatten all the path files down to one array of files.
        .then(function(fileGroups) {
            return fileGroups.reduce(function(a, b) {
                return a.concat(b);
            });
        });
};

/**
 * Filter the provided files based on files already in the manifest.
 *
 * @param Array files
 * @return array
 */
Manifest.prototype.filterInManifest = function(files) {
    var manifestFiles = this.config.retrieve().files;
    return files.filter(function(file) {
        return !manifestFiles.some(function(entry) {
            return entry.name === file.name && entry.hash === file.hash;
        });
    });
};

module.exports = Manifest;
module.exports.$name = 'manifest';
module.exports.$inject = ['config', 'md5'];
