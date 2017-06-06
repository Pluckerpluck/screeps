var webpack = require('webpack');
var path = require('path');
var fs = require('fs');

var nodeModules = {};
fs.readdirSync('node_modules')
    .filter(function (x) {
        return ['.bin'].indexOf(x) === -1 && x != "screeps-profiler";
    })
    .forEach(function (mod) {
        nodeModules[mod] = 'commonjs ' + mod;
    });

module.exports = {
    entry: './build/ts/main.js',
    target: 'node',
    output: {
        path: path.join(__dirname, 'build/js'),
        filename: 'backend.js',
        libraryTarget: "commonjs2"
    },
    externals: nodeModules
}
