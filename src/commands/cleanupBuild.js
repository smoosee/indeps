const { resolve } = require('path');
const { readdirSync, rmSync } = require('fs');
const { getConfig } = require("../util");


module.exports = (data) => {
    const { build: { distPath, files } } = getConfig();
    if (files) {
        const files = readdirSync(distPath);
        files.forEach(file => {
            const regex = new RegExp(`${(files || []).join('|')}`, 'g');
            const condition = !regex.test(file);
            if (condition) {
                rmSync(resolve(distPath, file), { recursive: true, force: true });
            }
        });
    }
}