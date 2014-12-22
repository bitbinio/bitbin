var fs = require('fs');
var Q = require('q');
var crypto = require('crypto');

/**
 * Reads contents of a file and computes the md5 hash sum.
 *
 * Usage:
 *   md5.computeFromFile('/path/to/file').then(console.log);
 *
 * @param string file Path to file.
 * @return promise
 */
var hashStream = function(file) {
	var deferred = Q.defer();
	var fd = fs.ReadStream(file);
	var hash = crypto.createHash('md5');
	fd.pipe(hash);
	fd.on('end', function() {
		hash.end();
		deferred.resolve(hash.read().toString('hex'));
	});

	return deferred.promise;
};

var proto = {
	computeFromFile: hashStream
};

module.exports = function() {
	return Object.create(proto);
};
module.exports.$type = 'factory';
module.exports.$name = 'md5';
