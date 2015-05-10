<img src="http://assets.boxmeupapp.com/img/bitbin-logo.png?v=1" alt="Bitbin" align="right">

[![Build Status](https://travis-ci.org/bitbinio/bitbin.svg?branch=master)](https://travis-ci.org/bitbinio/bitbin)
[![Dependency Status](https://david-dm.org/bitbinio/bitbin.svg)](https://david-dm.org/bitbinio/bitbin)
[![Huboard](https://img.shields.io/badge/Hu-Board-7965cc.svg?style=flat)](https://huboard.com/bitbinio/bitbin)
[![Gitter](https://badges.gitter.im/Join Chat.svg)](https://gitter.im/bitbinio/bitbin)

Bitbin is an asset manager for large (and small) binary files. If you are tired of having to commit your images, videos, and sounds into your
git repo, this tool is for you.

<p style="clear: both"></p>

By using an [npm](https://npmjs.org)-style JSON manifest file, you can track all assets and their versions locally, and publish remotely for your deployments.

The goal of this project is to solve two problems:

1. Having to store large assets in source code repositories (making them slow to clone) for deployments.
2. Redeploying changes to images and other assets tend to need some manual cache busting.

## Commands

### Init

```
bitbin init
```

The `init` command inquires certain information and generates the initial `bitbin.json` for managing assets.

### Install

```
bitbin install
```

The `install` command copies all files not existing (or not the same) into your locally defined path from the remote adapter.

### Publish

```
bitbin publish
```

With the publish command, all files that are found different (or missing) from the files manifest will be pushed to your outbound adapter and the manifest file will be updated with the new
versions of the files.

What about conflicts?

If a file exists on the remote location, the process will increment the version number and if all else fails, will abort
operations. The thinking is to **NEVER** update/overwrite a file on the remote location, only add new files.

## Adapters

This library has equip-able adapters:

* [Amazon S3](https://github.com/bitbinio/bitbin-s3) (`bitbin-s3`) - _to be implemented_
* [FTP](https://github.com/bitbinio/bitbin-ftp) (`bitbin-ftp`) - _to be implemented_
* [Local](https://github.com/bitbinio/bitbin-local) (`bitbin-local`) - _wip_

To use any of these adapters, install them via their [npm](https://npmjs.org) packages:

```
npm install bitbin-local
```

### Custom Adapters

In the `bitbin.json` configuration, the `adapter` property can be used to define
a path to a custom adapter that inherits a [base adapter](https://github.com/cjsaylor/bitbin/blob/master/src/base_adapter.js)
and implements its prototypical methods.

#### Example custom adapter

```javascript
var util = require('util');
var BaseAdapter = require('bitbin/src/base_adapter');

var MyAdapter = function() {
    // Special constructor stuff here
}

util.inherits(MyAdapter, BaseAdapter);

// Install methods

MyAdapter.prototype.ensureFilesExists = function(files) {
    var deferred = q.defer();
    // Check files and reject, otherwise resolve with files
    return deferred.promise;
};

MyAdapter.prototype.download = function(files) {
    var deferred = q.defer();
    // Retrieve the files and put them into the local path(s).
    return deferred.promise;
};

// Upload methods

MyAdapter.prototype.filterExisting = function(files) {
    // do custom filtering here
    return files;
};

MyAdapter.prototype.upload = function(files) {
    // upload files
    // Update any filenames with their versioning
    return files;
};

module.exports = function(container) {
    return new MyAdapter(
        // inject dependencies from the container provided
    );
};
```
