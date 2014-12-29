var BaseAdapter = require(__dirname + '/../src/base_adapter');

describe('base_adapter', function() {
    describe('#upsertVersion', function() {
        var adapter = new BaseAdapter();
        var expectations = [
            ['filename.jpg',      'filename__v1.jpg'],
            ['filename',          'filename__v1'],
            ['filename__v1',      'filename__v2'],
            ['filename__v1.jpg',  'filename__v2.jpg'],
            ['filename__v9.jpg',  'filename__v10.jpg'],
            ['filename__v9',      'filename__v10'],
            ['filename__v10.jpg', 'filename__v11.jpg'],
            ['filename__v10',     'filename__v11'],
            ['file.name.jpg',     'file.name__v1.jpg'],
            ['file.name__v1.jpg', 'file.name__v2.jpg'],
            ['img/sub/file.jpg',  'img/sub/file__v1.jpg'],
            ['img/sub/a__v1.jpg', 'img/sub/a__v2.jpg']
        ];
        resolveExpectations = function(expectation, i) {
            it('should attach/update appropriate version information to the filename #' + i, function() {
                var result = adapter.upsertVersion({name: expectation[0]});
                expect(result).to.have.property('originalName', expectation[0])
                expect(result).to.have.property('name', expectation[1]);
            });
        };
        expectations.forEach(resolveExpectations);
        it('should not update the originalName property on subsequent calls', function() {
            var result = adapter.upsertVersion({name: 'filename.jpg'});
            expect(result).to.have.property('originalName', 'filename.jpg');
            expect(result).to.have.property('name', 'filename__v1.jpg');
            result = adapter.upsertVersion(result);
            expect(result).to.have.property('originalName', 'filename.jpg');
            expect(result).to.have.property('name', 'filename__v2.jpg');
        });
    });
    describe('#transposeVersions', function() {
        it('should tranpose an array of files with their respective versions.', function() {
            var adapter = new BaseAdapter();
            var original = [
                {
                    name: 'filename.jpg',
                    hash: 'somehash'
                }
            ];
            var result = adapter.transposeVersions(original);
            expect(result).to.have.length(1);
            expect(result[0]).to.have.property('name', 'filename__v1.jpg');
            expect(result[0]).to.have.property('originalName', 'filename.jpg');
        });
    });
});
