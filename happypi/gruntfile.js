'use strict';
/*jslint node: true */

module.exports = function(grunt) {
    grunt.loadNpmTasks('grunt-mocha-test');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-jshint');

    grunt.initConfig({
        mochaTest: {
            test: {
                options: {
                    reporter: 'spec'
                },
                src: ['test/**/*.js']
            }
        },
        watch: {
            scripts: {
                files: ['*.js','test/**/*.js','lib/**/*.js'],
                tasks: ['jshint','mochaTest']
            }
        },
        jshint: {
            options: {
                curly: true,
                eqeqeq: true,
                eqnull: true,
                browser: true,
                globals: {
                    jQuery: true,
                    /* MOCHA */
                    "describe": false,
                    "it": false,
                    "before": false,
                    "beforeEach": false,
                    "after": false,
                    "afterEach": false
                },
             },
             all: ['*.js', 'lib/**/*.js', 'test/**/*.js']
         }
    });

grunt.registerTask('default','watch');
grunt.registerTask('lint','jshint');

};