purify
======

```javascript
var app = express(),
    purify = require('purify');

app.get('/:userId', function (req, res, next) {
    var userId = purify.positiveInteger(req.param('userId')),
        force = purify.positiveInteger(req.param('force'), true);
});
```
