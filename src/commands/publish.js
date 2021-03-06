var Publish = function(manifest, adapter) {
    this.manifest = manifest;
    this.adapter = adapter;
};

Publish.prototype.handle = function() {
    this.manifest.localFiles()
        .then(this.manifest.transposeWithMD5.bind(this.manifest))
        .then(this.manifest.filterInManifest.bind(this.manifest))
        .then(this.manifest.attachVersions.bind(this.manifest))
        // Check if everything got filtered out
        .then(function(files) {
            if (!files.length) {
                throw new Error('All contents match the manifest.');
            }
            return files;
        })
        .then(this.adapter.filterExisting.bind(this.adapter))
        .then(this.adapter.transposeVersions.bind(this.adapter))
        .then(this.adapter.upload.bind(this.adapter))
        .then(this.manifest.update.bind(this.manifest))
        .then(function(updated) {
            console.log('Uploaded:');
            updated.forEach(function(entry) {
                console.log(' * %s (v%d)', entry.name, entry.version);
            });
        })
        .catch(function(e) {
            if (process.env.DEBUG) {
                console.trace(e);
            } else {
                console.error(e.message);
            }
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
