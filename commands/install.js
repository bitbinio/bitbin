var path = require('path');
var fs = require('fs');
module.exports = function() {
    var config = require('../badassets.json');
    var manifest = config.files;
    config.paths.forEach(function(entry) {
        var dir = path.normalize(process.cwd() + '/' + entry);
        // replace with glob
        fs.readdir(dir, function(err, files) {
            files.forEach(function(file) {
                var normalized = path.normalize(entry + '/' + file);
                console.log(normalized);
                // push to manifest with hash and versioning
            });
        });
    });
    console.log(manifest);
};
