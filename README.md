purify
======

[![NPM version](https://badge.fury.io/js/purify.png)](http://badge.fury.io/js/purify)
[![Build Status](https://travis-ci.org/One-com/purify.png?branch=master)](https://travis-ci.org/One-com/purify)
[![Dependency Status](https://david-dm.org/One-com/purify.png)](https://david-dm.org/One-com/purify)

```javascript
var app = express(),
    purify = require('purify');

app.get('/:userId', function (req, res, next) {
    var userId = purify.positiveInteger(req.param('userId')),
        force = purify.positiveInteger(req.param('force'), true);
});
```
