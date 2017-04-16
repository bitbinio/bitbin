![Bitbin](https://www.bitbin.org/bitbin.png)
[![Build Status](https://travis-ci.org/bitbinio/bitbin.svg?branch=master)](https://travis-ci.org/bitbinio/bitbin)
[![Dependency Status](https://david-dm.org/bitbinio/bitbin.svg)](https://david-dm.org/bitbinio/bitbin)
[![Huboard](https://img.shields.io/badge/Hu-Board-7965cc.svg?style=flat)](https://huboard.com/bitbinio/bitbin)
[![Gitter](https://badges.gitter.im/Join Chat.svg)](https://gitter.im/bitbinio/bitbin)

Bitbin is an asset manager for large (and small) binary files. If you are tired of having to commit your images, videos, and sounds into your
git repo, this tool is for you.

<p style="clear: both"></p>

By using an [npm](https://npmjs.org)-style JSON manifest file, you can track all assets and their versions locally, and publish remotely for your deployments.

The goal of this project is to allow avoidance of storing large asset files in source code repositories (making them slow to clone) for deployments.

## Quick Start

#### Install bitbin

```
npm i -g bitbin
```

#### Initialize bitbin in your project.

```
bitbin init
```

* Select your adapter. (`bitbin-local`)
* Enter your local upload path. This is specific to the `bitbin-local` adapter. In this case, we'll select `/tmp/upload`.
* Enter the path to your assets. This should be a glob path that will grab all assets you want to upload. In this case, we want everything from our `img/` folder in this project, so we will enter: `img/**/*`.

This will produce the following `bitbin.json` in your project:

```json
{
    "adapter": "bitbin-local",
    "paths": [
        "img/**/*"
    ],
    "options": {
        "uploadPath": "/tmp/upload"
    }
}
```

If you need more granular control (ie multiple paths), you can edit the `bitbin.json` to include an additional paths in the array. For example:

```json
{
    "adapter": "bitbin-local",
    "paths": [
        "img/**/*",
        "sounds/**/*.mp3"
    ],
    "options": {
        "uploadPath": "/tmp/upload"
    }
}
```

#### Publish your assets

```
bitbin publish
```

This will push all files in your `img/` directory of your project to the upload path we specified earlier. This will produce a `bitbin.manifest.json` which should list all files that were uploaded with their version.

You should commit both the `bitbin.json` and the `bitbin.manifest.json` to your project, but ignore anything in the `img/` folder. Bitbin will now manage these assets of your application outside of your [VCS](https://en.wikipedia.org/wiki/Revision_control).

## Commands

[![Join the chat at https://gitter.im/bitbinio/bitbin](https://badges.gitter.im/Join%20Chat.svg)](https://gitter.im/bitbinio/bitbin?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)

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
* [Local](https://github.com/bitbinio/bitbin-local) (`bitbin-local`)

These adapters are considered built in and are packaged with Bitbin.

### Custom Adapters

In the `bitbin.json` configuration, the `adapter` property can be used to define
a path to a custom adapter that inherits a [base adapter](https://github.com/cjsaylor/bitbin/blob/master/src/base_adapter.js)
and implements its prototypical methods. All of the built-in adapters use the base adapter and are implemented in standalone libraries. You can use these as an example of how to implement your own.

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

---

## Credits

* **Logo**: [@Kaue_Ribeiro](https://twitter.com/Kaue_Ribeiro)
