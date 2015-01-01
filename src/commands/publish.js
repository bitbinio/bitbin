var Publish = function(manifest, adapter) {
    this.manifest = manifest;
    this.adapter = adapter;
};

Publish.prototype.handle = function() {
    this.manifest.localFiles()
        .then(this.manifest.transposeWithMD5.bind(this.manifest))
        .then(this.manifest.filterInManifest.bind(this.manifest))
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
        .then(this.adapter.renameUploadedFiles.bind(this.adapter))
        .then(this.manifest.update.bind(this.manifest))
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
