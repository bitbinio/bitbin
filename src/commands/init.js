var inquirer = require('inquirer');
var Init = function(config) {
    this.config = config;
};

Init.prototype.handle = function() {
    var questions = [
        {
            type: 'input',
            name: 'adapter',
            message: 'Upload provider to use:',
            default: 'S3'
        },
        {
            type: 'password',
            name: 'S3key',
            message: 'S3 key:',
            when: function(answers) {
                return answers.adapter === 'S3';
            }
        },
        {
            type: 'password',
            name: 'S3secret',
            message: 'S3 Secret Key:',
            when: function(answers) {
                return answers.adapter === 'S3';
            }
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
            paths: [answers.paths]
        };
        if (answers.S3key) {
            config.options = {
                key: answers.S3key,
                secret: answers.S3secret
            }
        };
        this.config.write(config);
    }.bind(this));
};

module.exports = Init;
module.exports.$name = 'command.init';
module.exports.$inject = ['config'];
