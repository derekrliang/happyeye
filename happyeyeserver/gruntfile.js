module.exports = function(grunt) {

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
      
    jshint: {
      files: ['*.js'],
      options: {
        globals: {
          jQuery: true,
          console: true,
          module: true,
          document: true
        }
      }
    },
    
    watch: {
      files: ['<%= jshint.files %>'],
      tasks: ['express:dev:stop','jshint','express:dev'],
      options: {
          spawn: false
      }
    },
    
    express: {
        options: {
        },
        dev: {
        options: {
            script: 'server.js',
            node_env: 'development'
        }}
  }
    
  });

  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-express-server');
   
  grunt.registerTask('default', ['jshint','express:dev','watch']);

};