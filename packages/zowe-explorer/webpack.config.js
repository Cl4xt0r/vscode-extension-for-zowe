/*
* This program and the accompanying materials are made available under the terms of the *
* Eclipse Public License v2.0 which accompanies this distribution, and is available at *
* https://www.eclipse.org/legal/epl-v20.html                                      *
*                                                                                 *
* SPDX-License-Identifier: EPL-2.0                                                *
*                                                                                 *
* Copyright Contributors to the Zowe Project.                                     *
*                                                                                 *
*/


//@ts-check

'use strict';

const path = require('path');
const fs = require("fs");

const webpack = require("webpack");
const { NLSBundlePlugin } = require('vscode-nls-dev/lib/webpack-bundler');

const id = 'ZOWE.vscode-extension-for-zowe';
const distFolderPath = path.resolve(__dirname, 'dist');

/**@type {import('webpack').Configuration}*/
const config = {
    optimization: {
      minimize: false
    },
    target: 'node', // vscode extensions run in a Node.js-context 📖 -> https://webpack.js.org/configuration/node/
    entry: './src/extension.ts', // the entry point of this extension, 📖 -> https://webpack.js.org/configuration/entry-context/
    output: { // the bundle is stored in the 'out/src' folder (check package.json), 📖 -> https://webpack.js.org/configuration/output/
        path: distFolderPath,
        filename: 'extension.bundle.js',
        libraryTarget: "commonjs2",
        devtoolModuleFilenameTemplate: info => {
          const source = info.absoluteResourcePath;
          if (source.startsWith('/')) {
            return path.relative(distFolderPath, source);
          }
          if (source.startsWith('webpack/')) {
            return 'webpack: ' + source.slice(8);
          }
          if (source.startsWith('external ')) {
            return 'external: ' + source.slice(9);
          }
          return source;
        }
    },
    devtool: 'source-map',
    externals: {
        // Add modules that cannot be webpack'ed, 📖 -> https://webpack.js.org/configuration/externals/
        vscode: "commonjs vscode", // the vscode-module is created on-the-fly and must be excluded. Add other modules that cannot be webpack'ed, 📖 -> https://webpack.js.org/configuration/externals/
        keytar: "commonjs keytar",
    },
    resolve: { // support reading TypeScript and JavaScript files, 📖 -> https://github.com/TypeStrong/ts-loader
        extensions: ['.ts', '.js']
    },
    node: {
        __dirname: false, // leave the __dirname behavior intact
    },
    stats: {
        // Ignore warnings
        warnings: false
    },
    module: {
        rules: [{
            test: /\.ts$/,
            exclude: /node_modules/,
            use: [{
              loader: 'vscode-nls-dev/lib/webpack-loader',
              options: {
                  base: path.join(__dirname, 'src')
              }
            }, {
              loader: 'ts-loader',
            }]
        }]
    },
    plugins: [
        new webpack.BannerPlugin(fs.readFileSync('../../.vscode/banner.txt', 'utf8')),
        new NLSBundlePlugin(id)
    ]
}

module.exports = config;
