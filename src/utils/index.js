const minify = require('@node-minify/core');
const uglifyjs = require('@node-minify/uglify-js');

minify({
    compressor: uglifyjs,
    input: '../index.js',
    output: '../../dist/src/index.js',
    callback: function (err, min) {
        console.log('unable to compress ', JSON.stringify(err));
    }
});