purify
======

[![NPM version](https://img.shields.io/npm/v/purify)](https://www.npmjs.com/package/purify)
[![Build Status](https://travis-ci.org/One-com/purify.svg?branch=master)](https://travis-ci.org/One-com/purify)
[![Coverage Status](https://coveralls.io/repos/github/One-com/purify/badge.svg?branch=master)](https://coveralls.io/github/One-com/purify?branch=master)
[![Dependency Status](https://david-dm.org/One-com/purify.svg)](https://david-dm.org/One-com/purify)

The library provides a number of battle tested validation functions. Each returns the
value supplied or a `defaultValue`. Mostly, you can leave `defaultValue` empty, which
will cause purify to return `undefined` in case the value doesn't pass validation.

Usage
-----

The library can be installed by simply installing `purify` from npm and can be used
body on node with `require('purify')` or as a self-contained UMD browser bundle that
can be used directly in a script tag as follows:  
`<script src="./node_modules/lib/purify.js">`

Example
-------

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

API
---

* `.email(rawValue, defaultValue)`
* `.emailIdn(rawValue, defaultValue)` - Returns e-mail with non-punycoded form regardless of input.
* `.domainName(rawValue, defaultValue)`
* `.domainNameIdn(rawValue, defaultValue)` - Returns domain in non-punycoded form regardless of input.
* `.url(rawValue, defaultValue)`
* `.urlWithLocalhost(rawValue, defaultValue)`

* `.integer(rawValue, defaultValue)`
* `.integerInRange(rawValue, lower, upper, defaultValue)`
* `.positiveInteger(rawValue, defaultValue)`
* `.positiveIntegerOrZero(rawValue, defaultValue)`
* `.float(rawValue, defaultValue)`
* `.positiveFloat(rawValue, defaultValue)`
* `.positiveFloatOrZero(rawValue, defaultValue)`

* `.nonEmptyVisibleUnicode(rawValue, defaultValue)`
* `.visibleUnicode(rawValue, defaultValue)`
* `.nonEmptyPrintableUnicode(rawValue, defaultValue)`
* `.printableUnicode(rawValue, defaultValue)`
* `.nonEmptyVisibleAscii(rawValue, defaultValue)`
* `.visibleAscii(rawValue, defaultValue)`
* `.nonEmptyPrintableAscii(rawValue, defaultValue)`
* `.printableAscii(rawValue, defaultValue)`

* `.alphaNumeric(rawValue, defaultValue)`
* `.nonEmptyAlphaNumeric(rawValue, defaultValue)`
* `.alphaNumericWithDot(rawValue, defaultValue)`

* `.uuid(rawValue, defaultValue)`
* `.upperCaseUuid(rawValue, defaultValue)`
* `.lowerCaseUuid(rawValue, defaultValue)`

* `.json(rawValue, defaultValue)`
