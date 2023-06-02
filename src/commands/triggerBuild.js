const fs = require('fs');
const xml2js = require('xml2js');
const { execSync } = require('child_process');
const { getConfig } = require('../util');

const { library } = getConfig();

async function getCurrentVersion() {
    const versionFileContent = fs.readFileSync(library.versionFile, 'utf8');
    let result;
    if (library.versionFile.endsWith('.xml')) {
        result = await xml2js.parseStringPromise(versionFileContent);
    } else if (library.versionFile) {
        result = JSON.parse(versionFileContent);
    }
    return result?.version || library.version;
}

const version = getCurrentVersion();

if (!fs.existsSync(library.buildFile)) {
    fs.writeFileSync(library.buildFile, JSON.stringify({ version, build: 0 }));
}

// Read version and build number from build.json file
const buildFileContent = fs.readFileSync(library.buildFile, 'utf8');
const buildData = JSON.parse(buildFileContent);

// Pump version and build number
const now = new Date();
const date = now.toISOString().slice(0, 10);
const time = now.toTimeString().slice(0, 8);
const build = date === buildData.date ? buildData.build + 1 : 1;

// Write new version, build number, and date to build.json file
const newData = { ...buildData, version, build, date, time };
fs.writeFileSync(buildFilePath, JSON.stringify(newData, null, 2));

// Create git commit for build.json file
execSync(`git add ${buildFilePath}`);
execSync(`git commit -m "Bump version to ${newVersion} (build ${newBuild})"`);

// Create git tag for commit
execSync(`git tag v${newVersion}-build${newBuild}`);

// Push commit and tag to remote repo
execSync('git push');
execSync('git push --tags');