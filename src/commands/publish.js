var Publish = function(manifest, adapter) {
    this.manifest = manifest;
    this.adapter = adapter;
};

Publish.prototype.handle = function() {
    this.manifest.localFiles()
        .then(this.manifest.transposeWithMD5.bind(this.manifest))
        .then(this.manifest.filterInManifest.bind(this.manifest))
        .then(this.adapter.filterExisting.bind(this.adapter))
        .then(this.adapter.transposeVersions.bind(this.adapter))
        // @todo upload all remaining files
        // @todo update manifest file
        .then(function(updated) {
            console.log('Uploaded:');
            updated.forEach(function(entry) {
                console.log('%s --> %s', entry.originalName, entry.name);
            });
            console.log(JSON.stringify(updated, null, 4));
        })
        .catch(function(e) {
            console.error(e.message);
            process.exit(1);
        })
        .done(function() {
            console.log('\nPublish complete');
        });
};

module.exports = Publish;
module.exports.$name = 'command.publish';
module.exports.$type = 'service';
module.exports.$inject = ['manifest', 'adapter'];
