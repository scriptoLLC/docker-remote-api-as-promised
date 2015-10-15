'use strict'

var Dr = require('docker-remote-api')
var Promise = require('native-or-bluebird')

var dkr

function drPromised (method, url, opts) {
  opts = opts || {}
  var json = false

  // using the json flag on docker-remote-api makes things hard so we'll
  // fix that
  if (opts.json) {
    json = true
    delete opts.json
  }

  if (method === 'post' && !opts.body) {
    opts.body = null
  }

  return new Promise(function (resolve, reject) {
    dkr[method](url, opts, function (err, stream) {
      var statusRange = 2

      if (stream && stream.statusCode) {
        statusRange = Math.floor(stream.statusCode / 100)
      }

      if (err || statusRange !== 2) {
        return reject(err)
      }

      var data = []

      if (!stream) {
        return resolve(true)
      }

      stream
        .on('data', function (chunk) {
          data.push(chunk.toString())
        })
        .on('error', function (err) {
          reject(err)
        })
        .on('end', function () {
          var resp = data.join('')

          if (json) {
            resp = JSON.parse(resp)
          }

          resolve(resp)
        })
    })
  })
}

module.exports = function (host) {
  if (!dkr) {
    dkr = new Dr(host)
  }

  return {
    post: function (url, opts) {
      return drPromised('post', url, opts)
    },
    get: function (url, opts) {
      return drPromised('get', url, opts)
    },
    delete: function (url, opts) {
      return drPromised('delete', url, opts)
    },
    put: function (url, opts) {
      return drPromised('put', url, opts)
    }
  }
}
