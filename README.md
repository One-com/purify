purify
======

[![NPM version](https://badge.fury.io/js/purify.png)](http://badge.fury.io/js/purify)
[![Build Status](https://travis-ci.org/One-com/purify.png?branch=master)](https://travis-ci.org/One-com/purify)
[![Coverage Status](https://coveralls.io/repos/One-com/purify/badge.png)](https://coveralls.io/r/One-com/purify)
[![Dependency Status](https://david-dm.org/One-com/purify.png)](https://david-dm.org/One-com/purify)



```javascript
var app = express(),
    purify = require('purify');

app.get('/:userId', function (req, res, next) {
    var userId = purify.positiveInteger(req.param('userId')),
        force = purify.boolean(req.param('force'), true);

    if (userId) {
        // ...
    } else {
        res.send(400);
    }
});
```
