const dayjs = require('dayjs');
const { readFileSync, writeFileSync } = require('fs');
const { resolve } = require('path');
const { getConfig, logger, getNextVersion } = require("../util");

module.exports = (data) => {
    const { build: { version: { filePath, prefix, map, increment } } } = getConfig();

    if (!filePath) {
        logger('error', 'No filePath property is present in the config file.');
        process.exit(1);
    }

    const pkg = require(resolve(process.cwd(), './package.json'));

    const versionMapper = map === 'major' ? '$3' : map === 'minor' ? '$2' : '$1';
    let pkgVersion = pkg.version.replace(/^(((.+)\..+)\..+)/g, versionMapper);
    if (increment) {
        pkgVersion = getNextVersion(increment);
    }

    const date = dayjs().format('YYYYMMDD.HHmmss');
    const buildNumber = process.env.BUILD_NUMBER || 'dev';

    const buildVersion = `${prefix}${pkgVersion}-${date}-${buildNumber}`;

    logger('info',
        `Reading "${map}" version from package.json`,
        `adding prefix`,
        `adding timestamp`,
        `adding CI build number`,
        `${buildVersion}`);


    logger('info', `Writing buildVersion into`, filePath);
    const cwd = process.cwd();
    const fileContent = readFileSync(resolve(cwd, filePath), { encoding: 'utf-8' });
    const updatedContent = fileContent.replace(/\$BUILD_VERSION/, buildVersion);
    writeFileSync(resolve(cwd, filePath), updatedContent, { encoding: 'utf-8' });
}