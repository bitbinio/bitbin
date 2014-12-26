# Badassets

Badassets is a package manager for binary files. If you are tired of having to commit your images and sounds into your
git repo, this is for you.

By using a "npm"-like JSON manifest file, you can track all assets and their versions locally, and publish remotely
for your deployments.

**Beware: This is pre-alpha software**

## Commands

### Init

The `init` command inquires certian information and generates the initial `badassets.json` for managing assets.

### Publish

With the publish command, all files that are found different (or missing) from the files manifest that are found in the
`paths` array will be pushed to your outbound adapter (S3 default) and the manifest file will be updated with the new
versions of the files.

What about conflicts?

If a file exists on the remote location, the process will increment the version number and if all else fails, will abort
operations. The thinking is to **NEVER** update/overwrite a file on the remote location, only add new files.

## Adapters

This library comes equiped with the following adapters:

* Amazon S3 (`S3`) - _to be implemented_
* Local (`local`) - _to be implemented_
* FTP (`ftp`) - _to be implemented_

### Custom Adapters

In the `badassets.json` configuration, the `adapter` property can be used to define
a path to a custom adapter that inherits a [base adapter](https://github.com/cjsaylor/badassets/blob/master/src/base_adapter.js)
and implements its prototypical methods.

#### Example custom adapter

```javascript
var util = require('util');
var BaseAdapter = require('badassets/src/base_adapter');

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
