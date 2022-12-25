const { getLocalPath, getConfig } = require('./src/util');

exports.shareDeps = ({ singleton = true, strictVersion = false, local = true, version, requiredVersion }) => {
    const { dependencies: { locals } } = getConfig();
    return Object.keys(locals).reduce((shared, dep) => {
        const localPath = getLocalPath(dep);
        version = version || `${local ? 'file:' : ''}${localPath}`;
        return {
            ...shared, [dep]: {
                singleton,
                strictVersion,
                version,
                requiredVersion: requiredVersion || 'auto',
            }
        }
    }, {});
}