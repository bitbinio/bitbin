var Publish = function(manifest) {
    this.manifest = manifest;
};

Publish.prototype.handle = function() {
    this.manifest.localFiles()
        .then(this.manifest.transposeWithMD5.bind(this.manifest))
        .then(this.manifest.filterInManifest.bind(this.manifest))
        // @todo filter out files already existing in upload adapter
        // @todo upload all remaining files
        // @todo update filenames with versions
        // @todo update manifest file
        .then(function(updated) {
            console.log('Uploaded:');
            updated.forEach(function(entry) {
                console.log(entry.name);
            });
            console.log(JSON.stringify(updated, null, 4));
        })
        // @todo upload files to adapter
        .done(function() {
            console.log('\nPublish complete');
        });
};

module.exports = Publish;
module.exports.$name = 'command.publish';
module.exports.$type = 'service';
module.exports.$inject = ['manifest'];
