'use strict';

var Dr = require('docker-remote-api');
var Promise = require('native-or-bluebird');

var dkr;

function drPromised(method, url, opts) {
  opts = opts || {};
  var json = false;

  // using the json flag on docker-remote-api makes things hard so we'll
  // fix that
  if (opts.json) {
    json = true;
    delete opts.json;
  }

  return new Promise(function(resolve, reject) {
    dkr[method].call(dkr, url, function(err, stream) {
      if (err) {
        return reject(err);
      }

      var data = [];

      stream
        .on('data', function(chunk) {
          data.push(chunk.toString());
        })
        .on('end', function(){
          var resp = data.join('');

          if (json) {
            resp = JSON.stringify(resp);
          }

          resolve(resp);
        });
    });
  });
}

module.exports = function(host) {
  if (!dkr) {
    dkr = new Dr(host);
  }

  return {
    post: function(url, opts){
      return drPromised('post', url, opts);
    },
    get: function(url, opts){
      return drPromised('get', url, opts);
    },
    delete: function(url, opts){
      return drPromised('delete', url, opts);
    },
    put: function(url, opts){
      return drPromised('put', url, opts);
    }
  };
};
