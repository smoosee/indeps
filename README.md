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
    
### cleanupBuild
### internals
### locals
### moveDist
### pkgVersion
### restoreDist

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