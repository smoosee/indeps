#!/usr/bin/env node

const dotenv = require('dotenv');
const commander = require('commander');
const pkg = require('./package.json');
const commands = require('./commands.json');

dotenv.config();

const program = new commander.Command();


program
    .name(Object.keys(pkg.bin)[0])
    .description(pkg.description)
    .version(pkg.version);


commands.forEach(command => {
    program
        .command(command.name)
        .description(command.description)
        .allowUnknownOption()
        .action((data, options) => {

        });
});

program.parse();