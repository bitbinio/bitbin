var pkg = require('./package.json');
var command = require('commander');
var subcommand = process.argv.slice(2, 3);

var container = require('./src/bootstrap')();

process.title = pkg.name;

command
    .version(pkg.version);

command
    .command('init')
    .description('Initialize a directory with configuration json.')
    .action(container.command.init.handle.bind(container.command.init));

command
    .command('publish')
    .description('Synchronize remote binary files to the publisher adapter.')
    .action(container.command.publish.handle.bind(container.command.publish));

command.parse(process.argv);

if (!subcommand.length || ['init', 'install', 'publish'].indexOf(subcommand[0]) < 0) {
    console.error();
    console.error('  Unknown command: ' + subcommand);
    command.help();
}
