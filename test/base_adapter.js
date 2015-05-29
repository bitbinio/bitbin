var BaseAdapter = require(__dirname + '/../src/base_adapter');

describe('base_adapter', function() {
    describe('#upsertVersion', function() {
        var adapter = new BaseAdapter();
        var file = {
            name: 'hello.txt',
            hash: 'somehash',
            version: 1
        };
        it('should increment an existing version number.', function() {
            var file = {
                name: 'hello.txt',
                hash: 'somehash',
                version: 1
            };
            adapter.upsertVersion(file);
            expect(file.version).to.equal(2);
        });
        it('should add a version property if not defined.', function() {
            var file = {
                name: 'hello.txt',
                hash: 'somehash'
            };
            adapter.upsertVersion(file);
            expect(file.version).to.equal(1);
        });
    });

    describe('#versionFilename', function() {
        var adapter = new BaseAdapter();
        var expectations = [
            [{name: 'filename.jpg', version: 1}, 'filename__v1.jpg'],
            [{name: 'img/sub/filename.jpg', version: 2}, 'img/sub/filename__v2.jpg'],
            [{name: 'img/sub/filename', version: 3}, 'img/sub/filename__v3']  
        ];
        var resolveExpectations = function(expectation, i) {
            it('should return a versioned filename #' + i, function() {
                expect(adapter.versionFilename(expectation[0])).to.equal(expectation[1]);
            });
        };
        expectations.forEach(resolveExpectations);
    });
    describe('#transposeVersions', function() {
        var adapter = new BaseAdapter();
        it('should tranpose an array of files with their respective versions.', function() {
            var original = [
                {
                    name: 'filename.jpg',
                    hash: 'somehash'
                },
                {
                    name: 'filename.gif',
                    hash: 'somehash',
                    version: 1
                }
            ];
            var result = adapter.transposeVersions(original);
            expect(result).to.have.length(2);
            expect(result[0]).to.have.property('version', 1);
            expect(result[1]).to.have.property('version', 2);
        });
    });
});
