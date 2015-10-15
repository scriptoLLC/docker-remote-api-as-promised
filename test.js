'use strict'

var test = require('tap').test
var docker = require('./')

var dkr = docker(process.env.DOCKER_SOCK || '/var/run/docker.sock')

test('it posts', function (t) {
  t.plan(2)
  dkr
    .post('/images/create?fromImage=hello-world', {
      body: null
    })
    .then(function (resp) {
      t.type(resp, 'string', 'got back a string')
      var success = /Already\ exists/.test(resp) || /Download\ complete/.test(resp)
      t.ok(success, 'download completed')
    })
    .catch(function (err) {
      t.notOk(!!err, err)
    })
})

test('it gets', function (t) {
  t.plan(1)
  dkr
    .get('/images/hello-world/json')
    .then(function (resp) {
      t.ok(resp)
    })
    .catch(function (err) {
      t.notOk(!!err, err)
    })
})

test('it parses json', function (t) {
  t.plan(1)
  dkr
    .get('/images/hello-world/json', {
      json: true
    })
    .then(function (resp) {
      t.type(resp, 'object', 'an object not a string')
    })
    .catch(function (err) {
      t.notOk(!!err, err)
    })
})

test('it add body to posts that do not have one', function (t) {
  t.plan(2)
  dkr
    .post('/images/create?fromImage=hello-world')
    .then(function (resp) {
      t.type(resp, 'string', 'got back a string')
      var success = /Already\ exists/.test(resp) || /Download\ complete/.test(resp)
      t.ok(success, 'success')
    })
    .catch(function (err) {
      t.notOk(!!err, err)
    })
})

test('it handles when something has no response', function (t) {
  t.plan(1)

  var imageName = `test${(new Date()).getTime()}`
  var image = 'hello-world'
  var details = {
    Hostname: '',
    Domainname: '',
    User: '',
    Memory: 0,
    MemorySwap: 0,
    CpuShares: 512,
    Cpuset: '0,1',
    AttachStdin: true,
    AttachStdout: true,
    AttachStderr: true,
    Tty: false,
    OpenStdin: false,
    StdinOnce: false,
    Env: null,
    Cmd: [],
    Entrypoint: '',
    Image: image,
    Volumes: {},
    WorkingDir: '',
    NetworkDisabled: false,
    ExposedPorts: {},
    SecurityOpts: [''],
    HostConfig: {
      Binds: [],
      Links: [],
      LxcConf: {},
      PortBindings: {},
      PublishAllPorts: false,
      Privileged: false,
      ReadonlyRootfs: false,
      Dns: [],
      DnsSearch: [''],
      ExtraHosts: null,
      VolumesFrom: [],
      CapAdd: [],
      Capdrop: [],
      RestartPolicy: {
        'Name': '',
        'MaximumRetryCount': 0
      },
      NetworkMode: 'bridge',
      Devices: []
    }
  }

  var opts = {
    qs: {
      name: imageName
    },
    body: JSON.stringify(details),
    headers: {
      'content-type': 'application/json'
    }
  }

  dkr
    .post('/images/create?fromImage=' + image)
    .then(function () {
      return dkr.post('/containers/create', opts)
    })
    .then(function () {
      return dkr.post(`/containers/${imageName}/stop`)
    })
    .then(function (worked) {
      t.ok(worked)
    })
    .catch(function (err) {
      t.error(err, 'no errors caught')
    })
})

test('it handles rejection', function (t) {
  t.plan(2)
  dkr
    .post('/image/create?fromImage=zoopitydoo')
    .then(function () {
      t.ok(false, 'you should not pass')
    })
    .catch(function (err) {
      t.ok(err, 'promise was rejected')
      t.equal(err.status, 404, 'status was 404 for image')
    })
})
