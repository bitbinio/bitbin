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
 * @param string file
 * @return string
 */
BaseAdapter.prototype.attachVersion = function(filename) {
    var extension = path.extname(filename);
    var baseName = path.basename(filename, extension);
    return this.patterns.version.test(baseName) ?
        filename.replace(this.patterns.version, versionReplacer) + extension :
        baseName + '__v1' + extension;
};

module.exports = BaseAdapter;
