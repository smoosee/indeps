const { execSync } = require("child_process");
const { lstatSync } = require("fs");
const { resolve } = require("path");
const { getConfig, logger, updateJsonFile, getLocalPath } = require("../util");

module.exports = (data) => {
  const {
    dependencies: { locals },
  } = getConfig();
  const cwd = process.cwd();
  const keys = Object.keys(locals || {});

  keys.forEach((name) => {
    const stats = lstatSync(resolve(cwd, "node_modules", name));

    if (stats.isSymbolicLink()) {
      logger(
        "error",
        "Dependency linking for",
        name,
        "already exists in node_modules"
      );
    } else {
      try {
        const result = execSync(`npm ls -g ${name}`);
        if (result) {
          logger("error", name, "already linked to global node_modules");
        }
      } catch (e) {
        const depPath = getLocalPath(name);
        logger(
          "info",
          "Linking dependency",
          name,
          `from "${depPath}"`,
          "to node_modules"
        );

        const updated = updateJsonFile(depPath, "package.json", { name });

        if (updated) {
          logger("info", `Linking ${name}`, `to global node_modules`);
          execSync(`npm link`, {
            cwd: resolve(cwd, depPath),
            stdio: "inherit",
          });
        }
      }
    }
  });

  logger(
    "info",
    `Linking ${keys}`,
    `from global node_modules`,
    `to local node_modules`
  );
  execSync(`npm link ${keys.join(" ")}`, { cwd, stdio: "inherit" });
};
