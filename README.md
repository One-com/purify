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
* `.visivleAscii(rawValue, defaultValue)`
* `.nonEmptyPrintableAscii(rawValue, defaultValue)`
* `.printableAscii(rawValue, defaultValue)`

* `.alphaNumeric(rawValue, defaultValue)`
* `.nonEmptyAlphaNumeric(rawValue, defaultValue)`
* `.alphaNumericWithDot(rawValue, defaultValue)`

* `.uuid(rawValue, defaultValue)`
* `.upperCaseUuid(rawValue, defaultValue)`
* `.lowerCaseUuid(rawValue, defaultValue)`

* `.json(rawValue, defaultValue)`

Mostly, you can leave `defaultValue` empty, which will cause purify to return
`undefined` in case the value doesn't pass validation.

