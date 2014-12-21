var pkg = require('./package.json');
var command = require('commander');

process.title = pkg.name;

command
    .version(pkg.version);

command
    .command('install')
    .description('Synchronize local binary files from publisher adapter.')
    .action(require('./commands/install'));
command
    .command('publish')
    .description('Synchronize remote binary files to the publisher adapter.')
    .action(require('./commands/publish'));

command.parse(process.argv);
