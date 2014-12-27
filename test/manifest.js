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
var md5 = require(__dirname + '/../src/md5')({
    node: {
        fs: require('fs')
    }
});

describe('manifest', function() {
    var manifest = new Manifest(config, md5, glob);
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
    describe('#transposeWithMD5', function() {
        var files = ['test/fixture/md5test.txt'];
        it('should transpose and remain the same array length', function(done) {
            manifest.transposeWithMD5(files).should.eventually.have.length(1).notify(done);
        });
        it ('should transpose a file list into an array of objects containing the md5 sum', function(done) {
            var expected = [
                {
                    name: 'test/fixture/md5test.txt',
                    hash: '77284ae4aac90cd005586850dce5fbd9',
                    canonical: 'test/fixture/md5test.txt'
                }
            ];
            manifest.transposeWithMD5(files).should.eventually.be.deep.include.members(expected).notify(done);
        })
    });
});
