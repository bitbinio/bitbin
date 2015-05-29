var inquirer = require('inquirer');
var Init = function(config, adapterInjector) {
    this.config = config;
    this.adapterInjector = adapterInjector;
};

var isS3 = function(answers) {
    return answers.adapter === 's3';
};
var isLocal = function(answers) {
    return answers.adapter === 'bitbin-local';
};

Init.prototype.handle = function() {
    var questions = [
        {
            type: 'list',
            name: 'adapter',
            message: 'Upload provider to use:',
            choices: this.adapterInjector.builtIn(),
            default: 'bitbin-local'
        },
        {
            type: 'input',
            name: 'localUploadPath',
            message: 'Local "upload" path:',
            when: isLocal
        },
        {
            type: 'input',
            name: 'paths',
            message: 'Enter path to assets:'
        }
    ];
    inquirer.prompt(questions, function(answers) {
        var config = {
            adapter: answers.adapter,
            paths: answers.paths.split(',')
        };
        if(isLocal(answers)) {
            config.options = {
                uploadPath: answers.localUploadPath
            };
        }
        this.config.write(config);
    }.bind(this));
};

module.exports = Init;
module.exports.$name = 'command.init';
module.exports.$inject = ['config', 'adapter_injector'];
