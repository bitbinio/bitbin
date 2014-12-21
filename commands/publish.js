var path = require('path');
var fs = require('fs');
var crypto = require('crypto');
var glob = require('glob');
module.exports = function() {
    var config = require('../badassets.json');
    config.paths.forEach(function(entry) {
        var cwd = process.cwd();
        // replace with glob
        glob(entry, {nodir: true}, function(err, files) {
            if (err) {
                console.error(err);
            }
            files.forEach(function(file) {
                var sum = crypto.createHash('md5');
                var stream = fs.ReadStream(file);
                stream.on('data', function(chunk) {
                    sum.update(chunk);
                });
                stream.on('end', function() {
                    config.files.push({
                        name: file,
                        hash: sum.digest('hex')
                    });
                    console.log(config);
                });
                // push to manifest with hash and versioning
            });
            
        });
    });
    
};
