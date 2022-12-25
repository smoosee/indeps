const { execSync } = require('child_process');
const { logger, getConfig } = require("../util");


module.exports = (data) => {
    const { dependencies: { internals, registry } } = getConfig();
    const deps = Object.keys(internals || {}).map(key => `${key}@${internals[key]}`);
    logger('info', 'Installing dependencies', ...deps, `from registry ${registry}`);

    const cmd = `npm i --no-save ${deps.join(' ')} --registry=${registry}`;
    execSync(cmd, { stdio: 'inherit' });
}