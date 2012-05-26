/*jshint node:true, globalstrict:true, es5:true, devel:true*/
'use strict';

var fs = require('fs'),
  path = require('path'),
  marked = require('marked'),
  Mustache = require('mustache');


function md2html(md) {
  var html = marked.lexer(md);

  html.forEach(function (item) {
    if (item.type === 'paragraph' && item.text.match(/^\./)) {
      item.type = 'html';
      item.text = item.text.slice(1);
    }
  });

  html = marked.parser(html);

  return html;
}

function generateSlideshow(directory, config) {
  var template, html, slides;

  template = fs.readFileSync(path.join(directory, config.template), 'utf8');

  slides = config.source.map(function (fileName) {
    var file = path.join(directory, fileName),
      content = fs.readFileSync(file, 'utf8');

    if (path.extname(file) === '.md') {
      return md2html(content);
    }
    return content; // probably a html file
  });

  config.slides = slides.join('\n');

  html = Mustache.to_html(template, config);
  fs.writeFileSync(path.join(directory, config.destination), html, 'utf8');
}

exports.generateSlideshow = generateSlideshow;