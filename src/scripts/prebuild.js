module.exports = (data) => {
    require('../commands/buildVersion')(data);
    require('../commands/pkgVersion')(data);
}