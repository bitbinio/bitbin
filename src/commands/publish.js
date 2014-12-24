var path = require('path');
var fs = require('fs');
var Q = require('q');

var Publish = function(config, manifest, md5) {
    this.config = config;
    this.manifest = manifest;
    this.md5 = md5;
};

Publish.prototype.handle = function() {
    var md5 = this.md5;
    var cwd = process.cwd();
    this.manifest.localFiles()
        // @todo move to manifest lib
        // compute md5 hashes
        .then(function(files) {
            var sumPromises = [];
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
                            hash: data[i],
                            canonical: entry
                        });
                    });
                    return entries;
                });
        })
        .then(this.manifest.filterInManifest.bind(this.manifest))
        // @todo filter out files already existing in upload adapter
        // @todo upload all remaining files
        // @todo update manifest file
        .then(function(data) {
            console.log(JSON.stringify(data, null, 4));
        })
        // @todo upload files to adapter
        .done(function() {
            console.log('Publish complete');
        });
};

module.exports = Publish;
module.exports.$name = 'command.publish';
module.exports.$type = 'service';
module.exports.$inject = ['config', 'manifest', 'md5'];
