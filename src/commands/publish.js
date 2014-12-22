var path = require('path');
var fs = require('fs');
var glob = require('glob');
var junk = require('junk');

var Publish = function(md5) {
    this.md5 = md5;
};

Publish.prototype.handle = function() {
    var config = require(__dirname + '/../../badassets.json');
    var md5 = this.md5;
    config.paths.forEach(function(entry) {
        var cwd = process.cwd();
        glob(entry, {nodir: true}, function(err, files) {
            if (err) {
                console.error(err);
            }
            files.filter(junk.not).forEach(function(file) {
                md5.computeFromFile(cwd + '/' + file).then(function(sum) {
                    config.files.push({
                        name: file,
                        version: 1,
                        canonical: file,
                        hash: sum
                    });
                    fs.writeFile(path.resolve(__dirname + '/../../badassets.json'), JSON.stringify(config, null, 4), function(err) {
                        if (err) {
                            console.error(err);
                        }
                        console.log(config);
                        console.log('Publish complete.');
                    });
                });
            });
        });
    });
};

module.exports = Publish;
module.exports.$name = 'command.publish';
module.exports.$type = 'service';
module.exports.$inject = ['md5'];
