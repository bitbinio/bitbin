var path = require('path');
var fs = require('fs');
var crypto = require('crypto');
var glob = require('glob');
module.exports = function() {
    var config = require(__dirname + '/../../badassets.json');
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
                        version: 1,
                        canonical: file,
                        hash: sum.digest('hex')
                    });
                    fs.writeFile(path.resolve(__dirname + '/../../badassets.json'), JSON.stringify(config, null, 4), function(err) {
                        if (err) {
                            console.error(err);
                        }
                        console.log(config);
                        console.log('Publish complete.');
                    });
                });
                // push to manifest with hash and versioning
            });
            
        });
    });
    
};
