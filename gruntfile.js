/*global module:false*/
module.exports = function(grunt) {
    "use strict";
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        jshint : {
            options : {
                    jshintrc : "jshint.json"
            },
            source : [
                'src/**/*.js',
                'gruntfile.js',
                'index.js'
            ]
        },
        mochaTest: {
            test: {
                options: {
                    reporter: 'spec',
                    require: 'test/support/bootstrap'
                },
                src: ['test/**/*.js'],
            }
        }
    });
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-mocha-test');

    grunt.registerTask('test', ['jshint', 'mochaTest']);
    grunt.registerTask('ci', ['test']);
    grunt.registerTask('default', ['test']);
};
