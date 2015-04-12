var junk = require('junk');
var q = require('q');

var Manifest = function(config, md5TransposeList, glob, fs) {
    this.config = config;
    this.md5Transposer = md5TransposeList;
    this.glob = glob;
    this.fs = fs;
};

var filterJunk = function(files) {
    return files.filter(junk.not);
};

/**
 * Retrieve the file list from the manifest file.
 *
 * @return promise
 */
Manifest.prototype.fileList = function() {
    return q.nfcall(this.fs.readFile, process.cwd() + '/bitbin.manifest.json', {encoding: 'utf8'})
        .then(function(files) {
            return JSON.parse(files);
        })
        .catch(function() {
            // @todo should check the err here to see if file doesn't exist or general error.
            return [];
        });
};

/**
 * Filter out files that already exist in the working path.
 *
 * @param array files
 * @return promise
 */
Manifest.prototype.filterExisting = function(files) {
    var deferred = q.defer();
    this.transposeWithMD5(files.map(function(file) {
        return file.name;
    })).then(function(hashedFiles) {
        deferred.resolve(files.filter(function(file) {
            return !hashedFiles.some(function(entry) {
                return entry.name === file.name && entry.hash === file.hash;
            });
        }));
    });

    return deferred.promise;
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
        pathPromises.push(q.nfcall(glob, path, {nodir: true}).then(filterJunk));
    });
    return !pathPromises.length ? 
        q.fcall(function() {
            throw new Error('No paths defined.');
        }) :
        q.all(pathPromises)
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
    return this.md5Transposer.transpose(files);
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
        });
};

/**
 * Update manifest for files that have been updated.
 *
 * @param array files
 * @return array
 */
Manifest.prototype.update = function(files) {
    var fs = this.fs;
    return this.fileList()
        .then(function(manifestFiles) {
            var hash = {};
            manifestFiles.forEach(function(file, i) {
                hash[file.name] = [i, file];
            });
            files.forEach(function(file) {
                var entry = {
                    name: file.name,
                    hash: file.hash
                };
                if (hash.hasOwnProperty(file.originalName)) {
                    manifestFiles[hash[file.originalName][0]] = entry;
                } else {
                    manifestFiles.push(entry);
                }
            });
            return manifestFiles;
        })
        .then(function(manifestFiles) {
            return q.nfcall(
                fs.writeFile,
                process.cwd() + '/bitbin.manifest.json',
                JSON.stringify(manifestFiles, null, 4)
            ).then(function() {
                return files;
            });
        });
};

module.exports = Manifest;
module.exports.$name = 'manifest';
module.exports.$inject = ['config', 'md5TransposeList', 'glob', 'node.fs'];
