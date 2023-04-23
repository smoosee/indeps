const { existsSync, readdirSync, rmSync, mkdirSync, renameSync, cpSync } = require('fs');
const { resolve } = require('path');
const { logger, getConfig } = require('../util');

module.exports = (data) => {
    const cwd = process.cwd();
    const { publish: { distPath, tempPath, keepFiles } } = getConfig();

    if (!existsSync(resolve(cwd, distPath, 'package.json'))) {
        keepFiles.push('package.json');
        logger('info', 'Keeping package.json from root directory');
    }

    if (!existsSync(resolve(cwd, tempPath))) {
        mkdirSync(resolve(cwd, tempPath));
    }

    logger('info', 'Moving all files', 'from root folder', `to ${tempPath} folder`);
    readdirSync(cwd).forEach(file => {
        const regex = new RegExp(`^(${keepFiles.join('|')})$`, 'dgi');
        const condition = !regex.test(file);
        if (condition) {
            cpSync(resolve(cwd, file), resolve(cwd, tempPath, file), { recursive: true, force: true });
            rmSync(resolve(cwd, file), { recursive: true, force: true })
        }
    });

    logger('info', 'Moving all files', `from ${distPath}`, `to root folder`);
    readdirSync(resolve(cwd, distPath)).forEach(file => {
        cpSync(resolve(cwd, distPath, file), resolve(cwd, file), { recursive: true, force: true });
        rmSync(resolve(cwd, distPath, file), { recursive: true, force: true });
    });
    rmSync(resolve(cwd, distPath), { recursive: true });
}