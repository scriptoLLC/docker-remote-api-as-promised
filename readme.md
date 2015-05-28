[![Circle CI](https://circleci.com/gh/scriptoLLC/docker-remote-api-as-promised.svg?style=svg)](https://circleci.com/gh/scriptoLLC/docker-remote-api-as-promised)

[![NPM](https://david-dm.org/scriptollc/docker-remote-api-as-promised.svg)](https://npmjs.org/package/docker-remote-api-as-promised/)

# docker-remote-api as promised

This is a promise-enabled wrapper for [docker-remote-api](https://github.com/mafintosh/docker-remote-api).

The API purports to be the same, just returning a promise for each transaction. Being though that a promise is returned, you must supply the `body` for a transaction via the options object.  There is also no ability to get back the response stream from Docker currently &emdash; you will receive the response as the argument to resolving the promise.

## Installation
```
npm install --save docker-remote-api-as-promised
```

## Usage
```js
var draap = require('docker-remote-api-as-promised');
var docker = draap('/var/run/docker.sock');

docker
  .post('/images/create?fromImage=busybox', {body: null})
  .then(function(response) {
    // do something with busybox
  })
  .catch(function(err) {
    //return an error!
  });
```

## License
Apache 2.0; Copyright 2015 Scripto