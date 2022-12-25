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

logger('info', 'Moving all files', 'from root folder', `to ${tempPath} folder`);
readdirSync(cwd).forEach(file => {
    const regex = new RegExp(`${keepArray.join('|')}`, 'g');
    const condition = !regex.test(file);
    if (condition) {
        renameSync(resolve(cwd, file), resolve(tempPath, file));
    }
});

logger('info', 'Moving all files', `from ${distPath}`, `to root folder`);
readdirSync(resolve(cwd, distPath)).forEach(file => {
    renameSync(resolve(cwd, distPath, file), resolve(cwd, file));
});
rmSync(resolve(cwd, distPath), { recursive: true });