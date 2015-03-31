var util = require('util');
var path = require('path');
var q = require('q');
var junk = require('junk');
var BaseAdapter = require(__dirname + '/../base_adapter');

var LocalAdapter = function(config, fs, glob, md5) {
    BaseAdapter.apply(this, arguments);
    this.uploadPath = config.retrieve().options.uploadPath;
    this.fs = fs;
    this.glob = glob;
    this.md5 = md5;
};

/**
 * @todo abstract this.
 */
var filterJunk = function(files) {
    return files.filter(junk.not);
};

var transposeMd5 = function(files) {
    var sumPromises = [];
    files.forEach(function(file) {
        sumPromises.push(this.md5.computeFromFile(file));
    }.bind(this));
    return q.all(sumPromises)
        .then(function(sums) {
            return files.map(function(entry, i) {
                return {
                    name: entry,
                    hash: sums[i]
                };
            });
        });
};

util.inherits(LocalAdapter, BaseAdapter);

/**
 * Filter files already existing in the upstream.
 *
 * @param array files
 * @return array
 */
LocalAdapter.prototype.filterExisting = function(files) {
    var uploadPath = this.uploadPath;
    return q.nfcall(this.glob, uploadPath + '/**/*', {nodir: true})
        .then(filterJunk)
        .then(transposeMd5.bind(this))
        .then(function(entries) {
            return files.filter(function(file) {
                return !entries.some(function(entry) {
                    return entry.name.substr(uploadPath.length + 1) === file.name && entry.hash === file.hash;
                });
            });
        });
};

/**
 * Upload files to the configured upload location.
 *
 * @param array files
 * @return promise
 */
LocalAdapter.prototype.upload = function(files) {
    var fs = this.fs;
    var uploadPath = this.uploadPath;
    var removeErrored = function(name, file) {
        return file.name !== name;
    };
    var handleError = function(err) {
        throw new Error(err);
    };
    var promises = [];
    files.forEach(function(file) {
        var filePath = path.normalize(uploadPath + '/' + path.dirname(file.name));
        var promise = q.nfcall(fs.mkdirp, filePath)
            .then(function() {
                var writer = fs.createWriteStream(path.normalize(uploadPath + '/' + file.name));
                var fd = fs.ReadStream(path.normalize(process.cwd() + '/' + file.originalName));
                writer.on('error', handleError);
                fd.on('error', handleError);
                fd.pipe(writer);
            })
            .catch(function(err) {
                files = files.filter(removeErrored.bind(null, file.name));
            });
        promises.push(promise);
    });
    return q.all(promises).then(q.bind(q, files));
};

module.exports = function(container) {
    return new LocalAdapter(
        container.config,
        container.node.fs,
        container.glob,
        container.md5
    );
};
