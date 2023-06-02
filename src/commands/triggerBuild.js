const fs = require('fs');
const xml2js = require('xml2js');
const { execSync } = require('child_process');
const { getConfig } = require('../util');

const { library } = getConfig();

async function getCurrentVersion() {
    const versionFileContent = fs.readFileSync(library.versionFile, "utf8");
    let result;
    if (library.versionFile.endsWith("pom.xml")) {
        result = await xml2js.parseStringPromise(versionFileContent);
    } else if (library.versionFile) {
        result = JSON.parse(versionFileContent);
    }
    return []
        .concat(result?.project?.version, library.version)
        .filter(Boolean)[0];
}

function createBuildFile(version) {
    if (!fs.existsSync(library.buildFile)) {
        fs.writeFileSync(library.buildFile, JSON.stringify({ version, build: 0 }));
    }

    // Read version and build number from build.json file
    const buildFileContent = fs.readFileSync(library.buildFile, "utf8");
    const buildData = JSON.parse(buildFileContent);

    // Pump version and build number
    const now = new Date();
    const date = now.toISOString().slice(0, 10);
    const time = now.toTimeString().slice(0, 8);
    const sameVersion = buildData.version === version;
    const sameDate = buildData.date === date;
    const build = sameVersion && sameDate ? buildData.build + 1 : 1;

    // Write new version, build number, and date to build.json file
    const newData = { ...buildData, version, build, date, time };
    fs.writeFileSync(library.buildFile, JSON.stringify(newData, null, 2));
    return { date, build };
}

function commitBuildFile(version, date, build) {
    const commitMessage = `Trigger build for version ${version} (date ${date}) (build ${build})`;

    // Create git commit for build.json file
    execSync(`git add ${library.buildFile}`);
    execSync(`git commit -m "${commitMessage}"`);

    // Create git tag for commit
    execSync(`git tag v${version}-date${date}-build${build}`);

    // Push commit and tag to remote repo
    execSync("git push");
    execSync("git push --tags");
}

module.exports = (data) => {
    getCurrentVersion().then((version) => {
        const { date, build } = createBuildFile(version);
        commitBuildFile(version, date, build);
    });
}