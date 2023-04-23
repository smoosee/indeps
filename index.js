#!/usr/bin/env node

const dotenv = require('dotenv');
const commander = require('commander');
const pkg = require('./package.json');
const commands = require('./commands.json');
const util = require('./src/util');

dotenv.config();

const config = util.getConfig();
const program = new commander.Command();


program
    .name(Object.keys(pkg.bin)[0])
    .description(pkg.description)
    .version(pkg.version);


commands.forEach(({ name, description, path }) => {
    program
        .command(name)
        .description(description)
        .allowUnknownOption()
        .action((data, options) => {
            const command = require(path || `./src/${name}.js`);
            command(data);
        });
});

program.parse(process.argv);