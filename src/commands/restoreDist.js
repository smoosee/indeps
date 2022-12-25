const { existsSync, readdirSync, rmSync, mkdirSync, cpSync } = require('fs');
const { resolve } = require('path');
const { logger, getConfig } = require('../util');

const cwd = process.cwd();
const { publish: { distPath, keepFiles } } = getConfig();

if (!existsSync(resolve(cwd, distPath, 'package.json'))) {
    keepFiles.push('package.json');
    logger('info', 'Keeping package.json from root directory');
}

const tempPath = resolve(cwd, '../.tmp');
if (!existsSync(tempPath)) {
    mkdirSync(tempPath);
}

logger('info', 'Removing old dist files', `from root folder`);
readdirSync(cwd).forEach(file => {
    const regex = new RegExp(`${keepFiles.join('|')}`, 'g');
    const condition = !regex.test(file);
    if (condition) {
        cpSync(resolve(cwd, file), resolve(distPath, file), { recursive: true, force: true });
        rmSync(resolve(cwd, file), { recursive: true, force: true })
    }
});

logger('info', 'Restoring all files', `from ${tempPath} folder`, `to root folder`);
readdirSync(resolve(cwd, tempPath)).forEach(file => {
    cpSync(resolve(cwd, tempPath, file), resolve(cwd, file), { recursive: true, force: true });
    rmSync(resolve(cwd, tempPath, file), { recursive: true, force: true });
});