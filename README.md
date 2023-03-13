<div style="text-align:center;" align="center">
    <h1>indeps</h1>
    <p>Configurable tools for managing internal dependencies.</p>
    
[![][img.release]][link.release]
[![][img.license]][link.license]

![][img.node]
![][img.npm]
![][img.downloads]

[![][img.health]][link.snyk]

[![][img.banner]][link.npm]

</div>

[img.release]: https://img.shields.io/github/actions/workflow/status/smoosee/indeps/release.yml?logo=github&label=release
[img.license]: https://img.shields.io/github/license/smoosee/indeps?logo=github
[img.node]: https://img.shields.io/node/v/@smoosee/indeps?logo=node.js&logoColor=white&labelColor=339933&color=grey&label=
[img.npm]: https://img.shields.io/npm/v/@smoosee/indeps?logo=npm&logoColor=white&labelColor=CB3837&color=grey&label=
[img.downloads]: https://img.shields.io/npm/dt/@smoosee/indeps?logo=docusign&logoColor=white&labelColor=purple&color=grey&label=
[img.health]: https://snyk.io/advisor/npm-package/@smoosee/indeps/badge.svg
[img.banner]: https://nodei.co/npm/@smoosee/indeps.png
[link.release]: https://github.com/smoosee/smoosee/actions/workflows/release.yml
[link.license]: https://github.com/smoosee/smoosee/blob/master/LICENSE
[link.npm]: https://npmjs.org/package/@smoosee/indeps
[link.snyk]: https://snyk.io/advisor/npm-package/@smoosee/indeps


<h2>Table of Contents</h2>

- [Installation](#installation)
- [Usage](#usage)
- [Configuration](#configuration)
- [Commands](#commands)
  - [buildVersion](#buildversion)
  - [cleanupBuild](#cleanupbuild)
  - [internals](#internals)
  - [locals](#locals)
  - [moveDist](#movedist)
  - [pkgVersion](#pkgversion)
  - [restoreDist](#restoredist)
- [Scripts](#scripts)
  - [postinstall](#postinstall)
  - [prestart](#prestart)
  - [prebuild](#prebuild)
  - [postbuild](#postbuild)
  - [prepack](#prepack)
  - [postpack](#postpack)


## Installation
Simply run
```
npm install @smoosee/indeps -D
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
    "$schema": "node_modules/@smoosee/indeps/schema.json"
```
- Or simply run `npx indeps init` command.

## Commands

### buildVersion
This command will use the following options to generate a build version and populate it into a file of your choice.
#### Options
*build.version.filePath*: 

Path of the file that includes the $BUILD_VERSION flag that will be replaced with the generated version.

*build.version.prefix*: 

Prefix that will be preappended to the generated version.

*build.version.map* -  (default: minor)

Mapping to be used when retrieving version from package.json. Values accepted major, minor & patch.

*build.version.increment* - (default: patch)

Part of the version that will be auto incremented. Values accepted major, minor, patch. Leave empty for no changes to the version.
    
### cleanupBuild
This command will remove various files from the dist path. Only the file patterns you include are the ones ignored.

#### Options
*build.distPath* -  (default: dist)

Path of the dist directory that will be cleaned up after build.

*build.files* - (default: [])

Files list that will be ignored during clean up. You do not need to input full names, this works like a glob.

### internals
This command will install dependencies from internal behind-proxy registry. The installed dependencies will not be added to package.json, but they will show in package-lock.json if applicable. This is very helpful when you need to install these dependencies after the regular install from npmjs registry.

#### Options
*dependencies.registry*

URL of the internal registry that will be used to install the dependencies.

*dependencies.internals*

A key-value map of dependencies that will be installed, the key represents the name of the package after installation. The value represents the actual name of the package in the internal registry.

For Example: "@smoosee/indeps": "internal-deps@1.0.34". This will install `internal-deps` with the version `1.0.34` and name it `@smoosee/indeps` in the node_modules directory.

This is the equivalent to executing
```
npm i --no-save @smoosee/indeps@internal-deps@1.0.34 --registry=https://registry.npmjs.org
```

### locals
This command will link dependencies that exist on the local filesystem into your working directory application. This is helpful when you need to work on a library for development reasons, and test it side-to-side with an application that consumes it. This basically navigates to the local package directory, link it to global node_modules, then navigate back to the application, and link it again from the global node_modules into the application node_modules.

#### Options
*dependencies.locals*

A key-value map of local dependencies that will be linked, the key represents the name of the package after installation. The value represents the actual path of the package on the local filesystem.


### moveDist
This command will move everything in the root directory (except the files you choose to ignore) to a temp directory, then move everything in dist path into the root directory. This is helpful when your CI can only run `npm pack` without navigating to the dist patch to pack there. This seems like extra steps, feel free to ignore. This is helpful to run in `prepack` script.

#### Options
*publish.distPath* - (default: dist)

Path of dist directory whose contents will moved to the root directory.

*publish.tempPath* - (default: ../.temp)

Path of the temp directory where the root directory contents will be moved.

*publish.keepFiles* 

List of file name patterns that will be ignored when moving the root directory contents. 


### pkgVersion
This command includes extra steps to retrieve the latest published version of the library from the npm registry. Then increment the configured version part and update the package.json file with that new value.

#### Options
*build.srcPath* - (default: src)

Path that contains the package.json file that needs updating. This is helpful if you need to update a different package.json than the one located in the root directory (in case you are using Typescript with different package.json that will be used for publishing).

*build.version.increment* - (default: patch)

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