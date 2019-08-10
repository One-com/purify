module.exports = function(config) {
    config.set({
        frameworks: ['mocha'],

        files: [
            './node_modules/unexpected/unexpected.js',
            './lib/purify.js',
            './test/purify.js'
        ],

        client: {
            mocha: {
                reporter: 'html',
                timeout: 60000
            }
        },

        browsers: ['ChromeHeadless'],

        reporters: ['dots']
    });
};
