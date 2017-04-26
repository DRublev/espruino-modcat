

var CardReader = function(opts) {
  this._fs = require('fs');
  if (typeof opts === 'number') {
    SPI2.setup({mosi: B15, miso: B14, sck: B13});
    E.connectSDCard(SPI2, opts);
  } else {
    E.connectSDCard(opts.spi, opts.cs);
  }
};

CardReader.prototype.isDirectory = function(fileName) {
  return this._fs.statSync(fileName).dir;
};

CardReader.prototype.appendFile = function(fileName, data) {
  return this._fs.appendFile(fileName, data);
};

CardReader.prototype.pipe = function(source, destination, options) {
  return this._fs.pipe(source, destination, options);
};

CardReader.prototype.readRandomFile = function(path) {
  var files = this.readDir(path);
  var idx = Math.floor(Math.random() * files.length);
  if (path[path.length-1] !== '/' && path[path.length-1] !== '\\') {
    path += '/';
  }
  return this._fs.readFile(path + files[idx]);
};

CardReader.prototype.MIME = function(fileName) {
  var ext = fileName.split('.');
  ext = ext[ext.length-1];
  if (ext === 'html') {
    return 'text/html';
  }
  if (ext === 'css') {
    return 'text/css';
  }
  if (ext === 'js') {
    return 'text/javascript';
  }
  return 'text/plain';
};

CardReader.prototype.readDir = function(path) {
  var files = this._fs.readdir(path);
  for (var i = files.length - 1; i >= 0; i--) {
    if (files[i] === '..' || files[i] === '.') {
      files.splice(i, 1);
    }
  }
  return files;
};

CardReader.prototype.readFile = function(fileName) {
  return this._fs.readFile(fileName);
};

CardReader.prototype.stat = function(fileName) {
  return this._fs.statSync(fileName);
};

CardReader.prototype.unlink = function(fileName) {
  return this._fs.unlink(fileName);
};

CardReader.prototype.writeFile = function(fileName, data) {
  return this._fs.writeFile(fileName, data);
};

exports.connect = function(opts) {
  return new CardReader(opts);
};