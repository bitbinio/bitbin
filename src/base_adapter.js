var path = require('path');
var q = require('q');
var BaseAdapter = function() {
    this.patterns = {
        version: /^(.*)__v(\d+).*$/
    };
};

/**
 * Checks all files in the list to ensure they exist and are what is required.
 *
 * The file should be the same path and MD5 hash. If any file does not exist
 * or does not match, it should reject the install.
 *
 * @param array files
 * @return promise
 */
BaseAdapter.prototype.ensureFilesExists = function(files) {
    throw new Error('ensureFilesExists not implemented on this adapter.');
};

/**
 * Download and store to the manifest location all files in the list.
 *
 * @param array files
 * @return promise
 */
BaseAdapter.prototype.download = function(files) {
    throw new Error('downloadFiles not implemented on this adapter.');
}

/**
 * Filter out of the files argument array that which is already existing.
 *
 * Depending on what the operation does, this can either return an array
 * (of similar format) or a promise.
 *
 * @param array files
 * @return array|promise
 */
BaseAdapter.prototype.filterExisting = function(files) {
    throw new Error('filterExisting not implemented on this adapter.');
};

/**
 * Upload all files provided to the adapter outbound.
 *
 * Any conflicting files should be sent through BaseAdapter#upsertVersion
 * to not over-write.
 *
 * @param array files
 * @return array|promise
 */
BaseAdapter.prototype.upload = function(files) {
    throw new Error('upload not implemented on this adapter.');
};

var versionReplacer = function(match, base, version) {
    return base + '__v' + (parseInt(version) + 1);
};

/**
 * Attach/update the version of provided file.
 *
 * The default behavior is to ammend __v# prior to the extension.
 * If no extension exists, __v# will be appended to the end of the filename.
 *
 * Will also attach an `originalName` property.
 *
 * @param object file File format as specified in the manifest
 * @return object
 */
BaseAdapter.prototype.upsertVersion = function(file) {
    var extension = path.extname(file.name);
    var baseName = path.basename(file.name, extension);
    var dirname = path.dirname(file.name);
    dirname = dirname !== '.' ? dirname + '/' : '';
    if (!file.originalName) {
        file.originalName = file.name;
    }
    if (this.patterns.version.test(baseName)) {
        file.name = dirname + baseName.replace(this.patterns.version, versionReplacer) + extension;
    } else {
        file.name = dirname + baseName + '__v1' + extension;
    }
    return file;
};

/**
 * Transpose an array of file objects to have an upserted version for the filename.
 *
 * See BaseAdapter#upsertVersion
 *
 * @param array files
 * @return array
 */
BaseAdapter.prototype.transposeVersions = function(files) {
    return files.map(this.upsertVersion.bind(this));
};

/**
 * Renames all files uploaded.
 *
 * @param array files
 * @return promise
 */
BaseAdapter.prototype.renameUploadedFiles = function(files) {
    var promises = [];
    var fs = this.fs;
    var cwd = process.cwd() + '/';
    files.forEach(function(file, index) {
        var deferred = q.defer();
        fs.rename(cwd + file.originalName, cwd + file.name, function(err) {
            if (err) {
                deferred.reject([err, index]);
            } else {
                deferred.resolve();
            }
        });
        promises.push(deferred.promise);
    });
    return q.allSettled(promises).then(function() {
        // @todo possibly do something with any files that had errors being renamed.
        return q(files);
    });
};

module.exports = BaseAdapter;
