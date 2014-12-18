var pkg = require('./package.json');
var command = require('commander');

process.title = pkg.name;

command
    .version(pkg.version);

command
    .command('install')
    .description('Synchronize remote binary files to be in line with the manifest.')
    .action(require('./commands/install'));

command.parse(process.argv);
