module.exports = {
    build: {
        srcPath: 'src',
        distPath: 'dist',
        version: {
            prefix: 'ts-v',
            map: 'minor',
            increment: 'patch',
            filePath: 'src/environments/environment.prod.ts'
        },
        files: []
    },
    publish: {
        distPath: 'dist',
        keepArray: ['dist', '.env', 'node_modules', '.git', '.gitignore', 'patches']
    }
}