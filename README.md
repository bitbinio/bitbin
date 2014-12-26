# Badassets

Badassets is a package manager for binary files. If you are tired of having to commit your images and sounds into your
git repo, this is for you.

By using a "npm"-like JSON manifest file, you can track all assets and their versions locally, and publish remotely
for your deployments.

**Beware: This is pre-alpha software**

### Init

The `init` command inquires certian information and generates the initial `badassets.json` for managing assets.

### Publish

With the publish command, all files that are found different (or missing) from the files manifest that are found in the
`paths` array will be pushed to your outbound adapter (S3 default) and the manifest file will be updated with the new
versions of the files.

What about conflicts?

If a file exists on the remote location, the process will increment the version number and if all else fails, will abort
operations. The thinking is to **NEVER** update/overwrite a file on the remote location, only add new files.
