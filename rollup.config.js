const pkg = require('./package.json');

module.exports = [
    {
        input: 'src/purify.js',
        output: {
            file: pkg.main,
            name: 'purify',
            format: 'umd',
            sourcemap: true,
            strict: false
        },
        plugins: [
            require('rollup-plugin-commonjs')(),
            require('rollup-plugin-node-resolve')({ preferBuiltins: false }),
            require('rollup-plugin-node-globals')()
        ]
    }
];
