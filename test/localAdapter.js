var localAdapter = require(__dirname + '/../src/adapters/local');
// mocks
var config = {
    retrieve: function() {
        return {
            options: {
                uploadPath: __dirname + '/fixture'
            },
            paths: ['/tmp/a', '/tmp/b']
        }
    }
};
var glob = function(path, opts, callback) {
    callback(null, [__dirname + '/fixture/md5test.txt']);
};
var md5 = require(__dirname + '/../src/md5')({
    node: {
        fs: require('fs')
    }
});

describe('adapters/local', function() {
    var adapter = localAdapter({
        config: config, 
        node: {fs: null},
        glob: glob,
        md5: md5
    });
    describe('#filterExisting', function() {
        it('should filter files already in the upload path', function(done) {
            var files = [
                {
                    name: 'sub/filea.jpg',
                    hash: ''
                },
                // should be filtered due to "existing" in the uploadPath.
                {
                    name: 'md5test.txt',
                    hash: '77284ae4aac90cd005586850dce5fbd9'
                }
            ];
            adapter.filterExisting(files).should.eventually.have.length(1).notify(done);
        })
    });
});
