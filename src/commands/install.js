var Install = function(manifest, adapter) {
    this.manifest = manifest;
    this.adapter = adapter;
};

Install.prototype.handle = function() {
    this.manifest.fileList()
        .then(this.manifest.filterExisting.bind(this.manifest)) // Filter what we already have
        .then(this.adapter.ensureFilesExists(this.adapter))
        .then(this.adapter.download.bind(this.adapter))
        .then(function(files) {
            files.forEach(function(file) {
                console.log('  * ' + file.name);
            });
        })
        .catch(function(e) {
            if (process.env.DEBUG) {
                console.trace(e);
            } else {
                console.error(e);
            }
            process.exit(1);
        })
        .done(function() {
            console.log('\nInstall complete.');
        });

};

module.exports = Install;
module.exports.$name = 'command.install';
module.exports.$type = 'service';
module.exports.$inject = ['manifest', 'adapter'];
