const { existsSync, readdirSync, rmSync, mkdirSync, renameSync } = require('fs');
const { resolve } = require('path');
const { logger, getConfig } = require('../util');

const cwd = process.cwd();
const { publish: { distPath, keepArray } } = getConfig();

if (!existsSync(resolve(cwd, distPath, 'package.json'))) {
    keepArray.push('package.json');
    logger('info', 'Keeping package.json from root directory');
}

const tempPath = resolve(cwd, '../.tmp');
if (!existsSync(tempPath)) {
    mkdirSync(tempPath);
}

logger('info', 'Removing old dist files', `from root folder`);
readdirSync(cwd).forEach(file => {
    const regex = new RegExp(`${keepArray.join('|')}`, 'g');
    const condition = !regex.test(file);
    if (condition) {
        rmSync(resolve(cwd, file), { recursive: true, force: true });
    }
});

logger('info', 'Restoring all files', `from ${tempPath} folder`, `to root folder`);
readdirSync(resolve(cwd, distPath)).forEach(file => {
    renameSync(resolve(tempPath, file), resolve(cwd, file));
});