'use strict';

var test = require('tap').test;
var docker = require('./');

var dkr = docker(process.env.DOCKER_SOCK || '/var/run/docker.sock');

test('it posts', function(t) {
  t.plan(2);
  dkr
    .post('/images/create?fromImage=busybox', {body: null})
    .then(function(resp) {
      t.type(resp, 'string', 'got back a string');
      t.ok(/Download\ complete/.test(resp), 'download completed');
    })
    .catch(function(err) {
      t.notOk(!!err, err);
    });
});

test('it gets', function(t) {
  dkr
    .get('/images/busybox/json')
    .then(function(resp) {
      t.ok(resp);
      t.end();
    })
    .catch(function(err) {
      t.notOk(!!err, err);
    });
});

test('it parses json', function(t) {
  dkr
    .get('/images/busybox/json', {json: true})
    .then(function(resp) {
      t.type(resp, 'object', 'an object not a string');
      t.end();
    })
    .catch(function(err) {
      t.notOk(!!err, err);
    });
});
