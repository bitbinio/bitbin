var Manifest = require(__dirname + '/../src/manifest');
// mocks
var config = {
    retrieve: function() {
        return {
            paths: ['/tmp/a', '/tmp/b'],
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
var fs = {
    readFile: function(name, callback) {
        callback(null, [
            {
                name: 'imagea.jpg',
                hash: 'somehash'
            }
        ]);
    }
};

describe('manifest', function() {
    var manifest = new Manifest(config, md5, glob, fs);
    describe('#localFiles', function() {
        it('should produce an array of files based on config paths', function(done) {
            manifest.localFiles().should.eventually.have.length(2).notify(done);
        });
        it('should produce a flat array of file names', function(done) {
            manifest.localFiles().should.eventually.include('imagea.jpg').notify(done);
        });
    });
    describe('#filterInManifest', function() {
        it('should filter all files already in the manifest', function(done) {
            var manifestFiles = [{name: 'imagea.jpg', hash: 'somehash'}];
            manifest.filterInManifest(manifestFiles).should.eventually.have.length(0).notify(done);
        });
        it('should filter no files', function(done) {
            var manifestFiles = [{name: 'imageb.jpg', hash: 'somehash'}];
            manifest.filterInManifest(manifestFiles).should.eventually.have.length(1).notify(done);
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
                }
            ];
            manifest.transposeWithMD5(files).should.eventually.be.deep.include.members(expected).notify(done);
        })
    });
});
