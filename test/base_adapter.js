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
            ['file.name__v1.jpg', 'file.name__v2.jpg']
        ];
        resolveExpectations = function(expectation, i) {
            it('should attach/update appropriate version information to the filename #' + i, function() {
                expect(adapter.upsertVersion(expectation[0])).to.equal(expectation[1]);
            });
        };
        expectations.forEach(resolveExpectations);
    });
});
