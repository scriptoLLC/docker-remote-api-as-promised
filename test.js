'use strict';

var test = require('tap').test;
var docker = require('./');

var dkr = docker(process.env.DOCKER_SOCK || '/var/run/docker.sock');

test('it gets', function(t) {
  t.plan(1);
  dkr
    .get('/images/create?fromImage=busybox')
    .then(function(resp) {
      t.ok(resp);
    })
    .catch(function(err) {
      t.notOk(!!err, err);
    });
});
