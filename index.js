var pkg = require('./package.json');
var command = require('commander');

var container = require('./src/bootstrap')();

process.title = pkg.name;

command
    .version(pkg.version);

command
    .command('publish')
    .description('Synchronize remote binary files to the publisher adapter.')
    .action(container.command.publish.handle.bind(container.command.publish));

command.parse(process.argv);
