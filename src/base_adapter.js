var path = require('path');
var BaseAdapter = function() {
    this.patterns = {
        version: /^(.*)__v(\d+).*$/
    };
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
        file.name = dirname + file.name.replace(this.patterns.version, versionReplacer) + extension;
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

module.exports = BaseAdapter;
