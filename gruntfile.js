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
        }
    });
    grunt.loadNpmTasks('grunt-contrib-jshint');

    grunt.registerTask('test', ['jshint']);
    grunt.registerTask('ci', ['test']);
    grunt.registerTask('default', ['test']);
};
