var path = require('path');
var q = require('q');
var BaseAdapter = function() {
    this.patterns = {
        version: /^(.*)__v(\d+)(.*)$/
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
};

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

/**
 * Transpose an array of file objects to have an upserted version for the filename.
 *
 * @param array files
 * @return array
 */
BaseAdapter.prototype.transposeVersions = function(files) {
    var upsertVersion = function(file) {
        file.version = file.version ? file.version + 1 : 1;
        return file;
    };
    return files.map(upsertVersion);
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
