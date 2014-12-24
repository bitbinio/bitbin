var Manifest = require(__dirname + '/../src/manifest');
// mocks
var config = {
    retrieve: function() {
        return {
            paths: ['/tmp/a', '/tmp/b'],
            files: [
                {
                    name: 'imagea.jpg',
                    hash: 'somehash'
                }
            ]
        }
    }
};
var glob = function(path, opts, callback) {
    callback(null, ['imagea.jpg']);
};

describe('manifest', function() {
    var manifest = new Manifest(config, null, glob);
    describe('#localFiles', function() {
        it('should produce an array of files based on config paths', function(done) {
            manifest.localFiles().should.eventually.have.length(2).notify(done);
        });
        it('should produce a flat array of file names', function(done) {
            manifest.localFiles().should.eventually.include('imagea.jpg').notify(done);
        });
    });
    describe('#filterInManifest', function() {
        it('should filter files already in the manifest', function(done) {
            var a = [{name: 'imagea.jpg', hash: 'somehash'}];
            var b = [{name: 'imageb.jpg', hash: 'somehash'}];
            assert(manifest.filterInManifest(a).length === 0, 'Should be filtered to nothing');
            assert(manifest.filterInManifest(b).length === 1, 'Should not filer anything');
            done();
        });
    });
});
