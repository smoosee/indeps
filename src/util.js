const { execSync } = require('child_process');
const { existsSync } = require('fs');
const { join, resolve } = require('path');
const { mergeWith, cloneDeep, isArray } = require('lodash');
const defaults = require('json-schema-defaults')(require('../schema.json'));

exports.mergeDeep = (oldObj, newObj) => {
    return mergeWith(cloneDeep(oldObj), newObj, (objValue, srcValue) => {
        if (isArray(objValue)) {
            return [].concat(...objValue, ...srcValue);
        }
    });
}

exports.getConfig = () => {
    const cwd = process.cwd();

    const paths = [
        process.env.INDEPS_CONFIG,
        '.indepsrc.json',
        '.indepsrc.json',
        '.indeps.json',
        '.indepsrc',
        'indeps.json',
    ];

    const configPath = paths.find(p => p && existsSync(resolve(cwd, p)));

    let config = require(resolve(cwd, 'package.json')).indeps || {};
    if (configPath) {
        config = require(resolve(cwd, configPath));
    }
    return this.mergeDeep(defaults, config);
};

exports.logger = (type, title, ...data) => {
    const icons = {
        info: '🔹',
        error: '🔸'
    };

    console.log();
    console.group(`${icons[type]}${title}`);
    data.forEach(x => console.log(`${icons[type]}${x}`));
    console.groupEnd();
}

exports.updateJsonFile = (parentPath, fileName, data) => {
    const cwd = process.cwd();
    const filePath = resolve(cwd, parentPath, fileName);
    if (existsSync(filePath)) {
        const file = require(filePath);
        Object.keys(data).forEach(key => {
            this.logger('info', `changing ${key}`, `from "${file[key]}"`, `to "${data[key]}"`, `in ${filePath}`);
            file[key] = data[key];
        });
        return true;
    } else {
        this.logger('error', `${fileName} does not exist in ${parentPath}`);
        return false;
    }
}

exports.getLatestVersion = () => {
    const { dependencies: { registry }, library } = this.getConfig();
    const pkg = require(resolve(process.cwd(), 'package.json'));
    const name = library?.name || pkg?.name;
    const version = library?.version || pkg?.version;

    try {
        this.logger('info', 'Getting published versions', `of ${name}`, `with version ${version}`, `from registry ${registry}`);
        const results = execSync(`npm --registry=${registry} view ${name}@~${version} version`, { encoding: 'utf8' }).replace(new RegExp(name, 'dgi'), '').split(/\n|@|,|'|\s|\]|\[/g).filter(Boolean);
        const versions = this.sortVersions(new Set(results));
        const latestVersion = versions.pop() || version;
        return latestVersion;
    } catch (e) {
        this.logger('error', 'Could not retrieve published version from npm registry');
        if (library?.version) {
            this.logger('info', 'Using the version provided in config file.');
            return library.version;
        } else {
            this.logger('info', 'Please indicate correct version in config file.');
        }
    }
}

exports.sortVersions = versions => {
    return [...versions]
        .map(x => {
            return x
                .split('.')
                .map(y => {
                    return y.padStart(5, '0');
                })
        })
        .sort()
        .map(x => {
            return x
                .map(y => {
                    return parseInt(y);
                })
                .join('.');
        });
}

exports.getNextVersion = (type = 'patch') => {
    const latestVersion = this.getLatestVersion();
    const [major, minor, patch] = latestVersion.split('.');
    const version = { major, minor, patch };
    version[type] = parseInt(version[type]) + 1;
    if (type === 'minor') {
        version.patch = 0;
    } else if (type === 'major') {
        version.patch = 0;
        version.minor = 0;
    }

    const nextVersion = `${version.major}.${version.minor}.${version.patch}`;

    this.logger('info', 'Latest retrieved version is', latestVersion, 'Next version is', nextVersion);

    return nextVersion;
}

exports.getLocalPath = (key) => {
    const { dependencies: { locals } } = this.getConfig();
    let returnValue;
    const value = locals[key];
    if (value instanceof Array) {
        value.forEach(x => {
            returnValue = this.getValidParentDirectory(x);
        });
    } else {
        returnValue = this.getValidParentDirectory(value);
    }
    return returnValue;
}


exports.getValidParentDirectory = (dirPath) => {
    if (existsSync(dirPath)) {
        return dirPath;
    } else {
        return this.getValidParentDirectory(join(dirPath, '..'));
    }
}