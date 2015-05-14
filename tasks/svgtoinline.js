/*
 * svgtoinline
 * 
 *
 * Copyright (c) 2015 Andy Coles
 * Licensed under the MIT license.
 */

'use strict';

module.exports = function (grunt) {

  // Please see the Grunt documentation for more information regarding task
  // creation: http://gruntjs.com/creating-tasks

  grunt.registerMultiTask('svgtoinline', 'Convert individual AI SVG files into svg versions to be used inline', function () {

    // Merge task-specific and/or target-specific options with these defaults.
    var options = this.options();

    // Iterate over all specified file groups.
    this.files.forEach(function (file) {
      // Concat specified files.
      var src = file.src.filter(function (filepath) {
        // Warn on and remove invalid source files (if nonull was set).
        if (!grunt.file.exists(filepath)) {
          grunt.log.warn('Source file "' + filepath + '" not found.');
          return false;
        } else {
          return true;
        }
      }).map(function (filepath) {
        // Read file source.
        var imgFile = grunt.file.read(filepath);
        var processName = options.processName || function (name) { return name; };
        var filename = processName(filepath);
        var theFile = filename.match(/\/([^/]*)$/)[1];
        var onlyName = theFile.slice(0, -4);
        var onlyNameNoIcon = onlyName.replace("Icon","");

        var viewBox = imgFile.match(/viewBox="\d+\s\d+\s\d+\s\d+"/);

        var svgOnly = imgFile.match(/<svg[^>]*>([\s\S]*?)<\/svg>/)[1];
            svgOnly = svgOnly.replace(/fill="#[\w\d]{3,6}"\s/g, "")

        var svgSymbol = '<symbol id="icon-' + onlyNameNoIcon + '" ' + viewBox + '>'
          + svgOnly
          + "</symbol>";

        grunt.file.write(file.dest, svgSymbol);
        grunt.log.writeln('File "' + file.dest + '" created.');

      });
    });
  });

};
