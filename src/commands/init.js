var inquirer = require('inquirer');
var Init = function(config, adapterInjector) {
    this.config = config;
    this.adapterInjector = adapterInjector;
};

var isS3 = function(answers) {
    return answers.adapter === 's3';
};
var isLocal = function(answers) {
    return answers.adapter === 'local';
};

Init.prototype.handle = function() {
    var questions = [
        {
            type: 'list',
            name: 'adapter',
            message: 'Upload provider to use:',
            choices: this.adapterInjector.builtIn(),
            default: 's3'
        },
        {
            type: 'input',
            name: 's3Bucket',
            message: 'S3 Bucket:',
            when: isS3
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
            adapter: 'bitbin-' + answers.adapter,
            paths: answers.paths.split(',')
        };
        if (isS3(answers)) {
            config.options = {
                bucket: answers.s3Bucket
            };
        } else if(isLocal(answers)) {
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
