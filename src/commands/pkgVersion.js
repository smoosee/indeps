const { writeFileSync, existsSync } = require('fs');
const { resolve } = require('path');
const { getConfig, logger, getNextVersion } = require("../util");

const cwd = process.cwd();
const { build: { srcPath, version: { increment } } } = getConfig();
if (increment) {
    const version = getNextVersion(increment);
    const pkgPath = resolve(cwd, srcPath, 'package.json');
    if (!existsSync(pkgPath)) {
        logger('error', 'No package.json file found in', resolve(cwd, srcPath));
        process.exit(1);
    }

    const pkg = require(pkgPath);
    const data = JSON.stringify({ ...pkg, version }, null, 4);

    logger('info', 'Updating version in', `${srcPath}/package.json`, `to ${version}`);
    writeFileSync(resolve(cwd, srcPath, 'package.json'), data, 'utf8');
} else {
    logger('error', 'No increment property present in config file.');
}