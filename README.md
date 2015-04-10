<img src="http://assets.boxmeupapp.com/img/bitbin-logo.png" alt="Bitbin" align="right">

[![Build Status](https://travis-ci.org/bitbinio/bitbin.svg?branch=master)](https://travis-ci.org/bitbinio/bitbin)
[![Dependency Status](https://david-dm.org/bitbinio/bitbin.svg)](https://david-dm.org/bitbinio/bitbin)
[![Huboard](https://img.shields.io/badge/Hu-Board-7965cc.svg?style=flat)](https://huboard.com/bitbinio/bitbin)
[![Gitter](https://badges.gitter.im/bitbinio.svg)](https://gitter.im/bitbinio)

Bitbin is an asset manager for binary files. If you are tired of having to commit your images, videos, and sounds into your
git repo, this project is for you.

<p style="clear: both"></p>

By using an "npm"-style JSON manifest file, you can track all assets and their versions locally, and publish remotely
for your deployments.

The goal of this project is to solve two problems:


1. Having to store large assets in source code repositories (making them slow to clone) for deployments.
2. Redeploying changes to images and other assets tend to need some manual cache busting.

**Beware: This is pre-alpha software**

## Commands

[![Join the chat at https://gitter.im/bitbinio/bitbin](https://badges.gitter.im/Join%20Chat.svg)](https://gitter.im/bitbinio/bitbin?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)

### Init

The `init` command inquires certian information and generates the initial `bitbin.json` for managing assets.

### Install

Copy all files not existing (or not the same) in your locally defined path from the remote adapter.

### Publish

With the publish command, all files that are found different (or missing) from the files manifest that are found in the
`paths` array will be pushed to your outbound adapter (S3 default) and the manifest file will be updated with the new
versions of the files.

What about conflicts?

If a file exists on the remote location, the process will increment the version number and if all else fails, will abort
operations. The thinking is to **NEVER** update/overwrite a file on the remote location, only add new files.

## Adapters

This library comes equiped with the following adapters:

* Amazon S3 (`bitbin-s3`) - _to be implemented_
* [Local](https://github.com/bitbinio/bitbin-local) (`bitbin-local`)
* FTP (`bitbin-ftp`) - _to be implemented_

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
