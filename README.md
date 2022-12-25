# indeps
Various tools for handling internal dependencies.

## Installation
Simply run
```
npm install @sheriffMoose/indeps -D
```

## Usage
You will be able to run `indeps` in standalone mode as `npx indeps`.

Or add the commands to your package.json scripts as in 
```
{
    ....
    "scripts": {
        "prestart": "indeps prestart"`,
        ....
    },
    ....
}
```

## Configuration
- You can create `.indepsrc.json` config file manually.
- Make sure your `.indepsrc.json` is using the latest json schema by including the following key
```
    "$schema": "node_modules/@sheriffmoose/indeps/schema.json"
```
- Or simply run `npx indeps init` command.

## Commands

### buildVersion
This command will use the following options to generate a build version and populate it into a file of your choice.
#### Options
**build.version.filePath**: Path of the file that includes the $BUILD_VERSION flag that will be replaced with the generated version.

**build.version.prefix**: Prefix that will be preappended to the generated version.

**build.version.map** -  (default: minor)

Mapping to be used when retrieving version from package.json. Values accepted major, minor & patch.

**build.version.increment** - (default: patch)

Part of the version that will be auto incremented. Values accepted major, minor, patch. Leave empty for no changes to the version.

    
### cleanupBuild
This command will remove various files from the dist path. Only the file patterns you include are the ones ignored.

#### Options
**build.distPath** -  (default: dist)

Path of the dist directory that will be cleaned up after build.

**build.files** - (default: [])

Files list that will be ignored during clean up. You do not need to input full names, this works like a glob.

### internals
This command will install dependencies from internal behind-proxy registry. The installed dependencies will not be added to package.json, but they will show in package-lock.json if applicable. This is very helpful when you need to install these dependencies after the regular install from npmjs registry.

#### Options
**dependencies.registry**

URL of the internal registry that will be used to install the dependencies.

**dependencies.internals**

A key-value map of dependencies that will be installed, the key represents the name of the package after installation. The value represents the actual name of the package in the internal registry.

For Example: "@sheriffMoose/indeps": "internal-deps@1.0.34". This will install `internal-deps` with the version `1.0.34` and name it `@sheriffMoose/indeps` in the node_modules directory.

This is the equivalent to executing
```
npm i --no-save @sheriffMoose/indeps@internal-deps@1.0.34 --registry=https://registry.npmjs.org
```

### locals
This command will link dependencies that exist on the local filesystem into your working directory application. This is helpful when you need to work on a library for development reasons, and test it side-to-side with an application that consumes it. This basically navigates to the local package directory, link it to global node_modules, then navigate back to the application, and link it again from the global node_modules into the application node_modules.

#### Options
**dependencies.locals**

A key-value map of local dependencies that will be linked, the key represents the name of the package after installation. The value represents the actual path of the package on the local filesystem.


### moveDist
This command will move everything in the root directory (except the files you choose to ignore) to a temp directory, then move everything in dist path into the root directory. This is helpful when your CI can only run `npm pack` without navigating to the dist patch to pack there. This seems like extra steps, feel free to ignore. This is helpful to run in `prepack` script.

#### Options
**publish.distPath** - (default: dist)

Path of dist directory whose contents will moved to the root directory.

**publish.tempPath** - (default: ../.temp)

Path of the temp directory where the root directory contents will be moved.

**publish.keepFiles** 

List of file name patterns that will be ignored when moving the root directory contents. 


### pkgVersion
This command includes extra steps to retrieve the latest published version of the library from the npm registry. Then increment the configured version part and update the package.json file with that new value.

#### Options
**build.srcPath** - (default: src)

Path that contains the package.json file that needs updating. This is helpful if you need to update a different package.json than the one located in the root directory (in case you are using Typescript with different package.json that will be used for publishing).

**build.version.increment** - (default: patch)

Which part of the version that will be incremented during the processing of this command.

### restoreDist
This command simply undoes the process made by the `moveDist` command. This is helpful if you need to run this after the actual `pack` process.

## Scripts
You can actually use the commands in their respective places by using scripts instead.

Scripts are just aliases for the commands to make more sense in the grander scheme of things.

For example: use `indeps postinstall` in your `postinstall` script instead of `indeps internals`.

### postinstall
This executes the `internals` command.

### prestart
This executes the `locals` command.

### prebuild
This executes both `buildVersion` & `pkgVersion` commands.

### postbuild
This executes `cleanupBuild` command.

### prepack
This executes `moveDist` command.

### postpack
This executes `restoreDist` command.