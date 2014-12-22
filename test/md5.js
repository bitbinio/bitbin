var md5 = require(__dirname + '/../src/md5')();

describe('md5', function() {
    describe('#computeFromFile', function() {
        it('should promise an md5 hash', function(done) {
            var file = __dirname + '/fixture/md5test.txt';
            var md5hash = '77284ae4aac90cd005586850dce5fbd9';
            md5.computeFromFile(file).should.eventually.equal(md5hash).notify(done);
        });
        it('should reject files not found', function(done) {
            md5.computeFromFile('nonexistent').should.be.rejected.notify(done);
        });
    });
});
