const { check } = require('prettier');
const { argv } = require('process');

var builder = (function () {
    const { esbuildPluginNodeExternals } = require('esbuild-plugin-node-externals')
    const { build: esbuild } = require('esbuild')
    const clean = require('esbuild-plugin-clean')
    const copy = require('esbuild-plugin-copy')
    const gen = require('dts-bundle-generator')
    const fs = require("fs")
    const path = require("path")
    const ts = require("typescript")

    const getAllFiles = function (dirPath, arrayOfFiles, filter) {
        files = fs.readdirSync(dirPath)
        arrayOfFiles = arrayOfFiles || []
        files.forEach(function (file) {
            if (fs.statSync(dirPath + "/" + file).isDirectory()) {
                arrayOfFiles = getAllFiles(dirPath + "/" + file, arrayOfFiles)
            } else {
                arrayOfFiles.push(path.join(dirPath, "/", file))
            }
        })
        return arrayOfFiles
    }

    const paths = {
        package: path.join(process.cwd(), 'package.json'),
        sourceFolder: path.join(process.cwd(), 'src'),
        sourceFile: path.join(process.cwd(), 'src/index.ts'),
        outputFolder: path.join(process.cwd(), 'dist'),
        outputFile: path.join(process.cwd(), 'dist/index.js'),
        outputDeclarationFile: path.join(process.cwd(), 'dist/index.d.ts'),
        tsConfig: path.join(process.cwd(), 'tsconfig.json'),
        jsonFiles: path.join(process.cwd(), 'src/**/*.json')
    }

    function getBuildConfig(env) {
        const config = {
            entryPoints: [paths.sourceFile],
            minify: true,
            sourcemap: false,
            platform: "node",
            bundle: true,
            outfile: paths.outputFile,
            plugins: [
                clean.default({
                    patterns: [path.join(paths.outputFolder, '*')]
                }),
                esbuildPluginNodeExternals({
                    // packagePaths: paths.package
                })
            ],
            logLevel: "debug"
        }
        if (env) {
            config.define = { "process.env.NODE_ENV": env }
        }
        return config
    }

    function build(env, skipDefinitions = false) {
        esbuild(getBuildConfig(env)).then(() => {
            if (skipDefinitions === false) {
                const dtsBundle = gen.generateDtsBundle([{
                    filePath: paths.sourceFile,
                    outFile: paths.outputDeclarationFile,
                    output: {
                        noBanner: true
                    }
                }], {
                    followSymlinks: false,
                    exportReferencedTypes: false
                })
                fs.writeFileSync(paths.outputDeclarationFile, dtsBundle[0])
            }
        })

    }

    return {
        paths: paths,
        getConfig: getBuildConfig,
        build: build
    }
})();

if (argv[2] === 'run') {
    builder.build(argv[3], argv[4] || false)
}