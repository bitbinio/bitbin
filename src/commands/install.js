var path = require('path');
var fs = require('fs');
var glob = require('glob');
module.exports = function() {
    var config = require('../badassets.json');
    var manifest = config.files;
    config.paths.forEach(function(entry) {
        var cwd = process.cwd();
        // replace with glob
        glob(entry, {nodir: true}, function(err, files) {
            if (err) {
                console.error(err);
            }
            files.forEach(function(file) {
                console.log(path.relative(process.cwd(), file));
                // push to manifest with hash and versioning
            });
        });
    });
};
