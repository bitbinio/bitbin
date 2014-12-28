var junk = require('junk');
var Q = require('q');

var Manifest = function(config, md5, glob, fs) {
    this.config = config;
    this.md5 = md5;
    this.glob = glob;
    this.fs = fs;
};

var filterJunk = function(files) {
    return files.filter(junk.not);
};

var originalManifestList;

/**
 * Retrieve the file list from the manifest file.
 *
 * @return promise
 */
Manifest.prototype.fileList = function() {
    // Subsequent calls shouldn't need to get the list again.
    if (originalManifestList) {
        return Q(originalManifestList);
    }
    return Q.nfcall(this.fs.readFile, process.cwd() + '/badassets.manifest.json')
        .then(function(files) {
            // Cache the original list
            return originalManifestList = files;
        });
};

/**
 * Retrieve all files located in the configured paths.
 *
 * @return promise
 */
Manifest.prototype.localFiles = function() {
    var pathPromises = [];
    var glob = this.glob;
    this.config.retrieve().paths.forEach(function(path) {
        pathPromises.push(Q.nfcall(glob, path, {nodir: true}).then(filterJunk));
    });
    return !pathPromises.length ? 
        Q.fcall(function() {
            throw new Error('No paths defined.');
        }) :
        Q.all(pathPromises)
            // flatten all the path files down to one array of files.
            .then(function(fileGroups) {
                return fileGroups.reduce(function(a, b) {
                    return a.concat(b);
                });
            });
};

/**
 * Compute MD5 hashes for all files and transposes the data into array of objects.
 *
 * @param array files
 * @return promise
 */
Manifest.prototype.transposeWithMD5 = function(files) {
    var sumPromises = [];
    var md5 = this.md5;
    var cwd = process.cwd();
    files.forEach(function(file) {
        sumPromises.push(md5.computeFromFile(cwd + '/' + file));
    });
    return Q.all(sumPromises)
        // map the sums
        .then(function(data) {
            var entries = [];
            files.forEach(function(entry, i) {
                entries.push({
                    name: entry,
                    hash: data[i]
                });
            });
            return entries;
        });
};

/**
 * Filter the provided files based on files already in the manifest.
 *
 * @param Array files
 * @return promise
 */
Manifest.prototype.filterInManifest = function(files) {
    return this.fileList()
        .then(function(manifestFiles) {
            return files.filter(function(file) {
                return !manifestFiles.some(function(entry) {
                    return entry.name === file.name && entry.hash === file.hash;
                });
            });
        })
        .catch(function() {
            return files;
        });
};

module.exports = Manifest;
module.exports.$name = 'manifest';
module.exports.$inject = ['config', 'md5', 'glob', 'node.fs'];
