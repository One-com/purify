var URL = require('url'),
    oneValidation = require('one-validation'),
    unicodeRegExp = require('unicoderegexp'),
    purify = module.exports = {};

// Note that ?myBooleanParam (without a value) is also considered 'true'.
purify.boolean = function (rawValue, defaultValue) {
    if (typeof rawValue === 'boolean') {
        return rawValue;
    } else if (typeof rawValue === 'string') {
        var isTrue  = /^(?:1|on|true|yes)$/.test(rawValue),
            isFalse = /^(?:0|off|false|no)$/.test(rawValue);
        return isTrue ? true : (isFalse ? false : defaultValue);
    }
    return defaultValue;
};

purify.email = purify.emailAddress = function (rawValue, defaultValue) {
    if (typeof rawValue === 'string' && oneValidation.email.test(rawValue)) {
        return rawValue.toLowerCase();
    }
    return defaultValue;
};

purify.emailRelaxed = purify.emailAddressRelaxed = function (rawValue, defaultValue) {
    if (typeof rawValue === 'string' && oneValidation.emailRelaxed.test(rawValue)) {
        return rawValue.toLowerCase();
    }
    return defaultValue;
};

purify.emailRelaxedIdn = purify.emailAddressRelaxedIdn = function (rawValue, defaultValue) {
    if (typeof rawValue === 'string' && oneValidation.emailRelaxedIdn.test(rawValue)) {
        return rawValue.toLowerCase();
    }
    return defaultValue;
};

purify.domain = purify.domainName = function (rawValue, defaultValue) {
    if (typeof rawValue === 'string' && oneValidation.domain.test(rawValue)) {
        return rawValue.toLowerCase();
    }
    return defaultValue;
};

purify.domainIdn = purify.domainNameIdn = function (rawValue, defaultValue) {
    if (typeof rawValue === 'string' && oneValidation.domainIdn.test(rawValue)) {
        return rawValue.toLowerCase();
    }
    return defaultValue;
};

purify.domainRelaxed = purify.domainNameRelaxed = function (rawValue, defaultValue) {
    if (typeof rawValue === 'string' && oneValidation.domainRelaxed.test(rawValue)) {
        return rawValue.toLowerCase();
    }
    return defaultValue;
};

purify.domainRelaxedIdn = purify.domainNameRelaxedIdn = function (rawValue, defaultValue) {
    if (typeof rawValue === 'string' && oneValidation.domainRelaxedIdn.test(rawValue)) {
        return rawValue.toLowerCase();
    }
    return defaultValue;
};

purify.url = function (rawValue, defaultValue) {
    if (typeof rawValue === 'string' && oneValidation.url.test(rawValue)) {
        return rawValue;
    }
    return defaultValue;
};

purify.urlRelaxed = function (rawValue, defaultValue) {
    if (typeof rawValue === 'string' && oneValidation.httpUrlRelaxed.test(rawValue)) {
        return rawValue;
    }
    return defaultValue;
};

var urlRelaxedWithLocalhostRegExp = new RegExp('^(?:' + oneValidation.createHttpishUrlRegExp({scheme: /https?/, relaxed: true, localhost: true}).source + ')$');

purify.urlRelaxedWithLocalhost = function (rawValue, defaultValue) {
    if (typeof rawValue === 'string' && urlRelaxedWithLocalhostRegExp.test(rawValue)) {
        return rawValue;
    }
    return defaultValue;
};

purify.integer = function (rawValue, defaultValue) {
    var integer;
    if (typeof rawValue === 'string') {
        integer = parseInt(rawValue, 10);
    } else if (typeof rawValue === 'number') {
        integer = Math.floor(rawValue);
    }
    if (typeof integer === 'number' && isFinite(integer) && !isNaN(integer)) {
        return integer;
    } else {
        return defaultValue;
    }
};

purify.integerInRange = function (rawValue, lower, upper, defaultValue) {
    var integer = purify.integer(rawValue);
    if (typeof integer === 'number' && !isNaN(integer) && isFinite(integer) && (typeof lower === 'undefined' || integer >= lower) && (typeof upper === 'undefined' || integer <= upper)) {
        return integer;
    }
    return defaultValue;
};

purify.positiveInteger = function (rawValue, defaultValue) {
    var integer = purify.integer(rawValue);
    if (typeof integer !== 'undefined' && !isNaN(integer) && isFinite(integer) && integer >= 1) {
        return integer;
    }
    return defaultValue;
};

purify.positiveIntegerOrZero = function (rawValue, defaultValue) {
    var integer = purify.integer(rawValue);
    if (typeof integer !== 'undefined' && !isNaN(integer) && isFinite(integer) && integer >= 0) {
        return integer;
    }
    return defaultValue;
};

purify.float = function (rawValue, defaultValue) {
    var number;
    if (typeof rawValue === 'string') {
        if (/^[\-+]?[0-9]*\.?[0-9]+$/.test(rawValue)) {
            number = parseFloat(rawValue);
        }
    } else if (typeof rawValue === 'number') {
        number = rawValue;
    }
    if (typeof number !== 'undefined' && !isNaN(number) && isFinite(number)) {
        return number;
    }
    return defaultValue;
};

purify.positiveFloat = function (rawValue, defaultValue) {
    var number;
    if (typeof rawValue === 'string') {
        if (/^\+?[0-9]*\.?[0-9]+$/.test(rawValue)) {
            number = parseFloat(rawValue);
        }
    } else if (typeof rawValue === 'number') {
        number = rawValue;
    }
    if (typeof number !== 'undefined' && !isNaN(number) && isFinite(number) && number > 0) {
        return number;
    }
    return defaultValue;
};

purify.positiveFloatOrZero = function (rawValue, defaultValue) {
    var number;
    if (typeof rawValue === 'string') {
        if (/^\+?[0-9]*\.?[0-9]+$/.test(rawValue)) {
            number = parseFloat(rawValue);
        }
    } else if (typeof rawValue === 'number') {
        number = rawValue;
    }
    if (typeof number !== 'undefined' && !isNaN(number) && isFinite(number) && number >= 0) {
        return number;
    }
    return defaultValue;
};

// Visible characters, full Unicode repertoire
var nonEmptyVisibleUnicodeRegExp = new RegExp("^" + unicodeRegExp.visible.source + "+$");
purify.nonEmptyVisibleUnicode = function (rawValue, defaultValue) {
    if (typeof rawValue === 'string' && nonEmptyVisibleUnicodeRegExp.test(rawValue)) {
        return rawValue;
    }
    return defaultValue;
};

// Visible characters, full Unicode repertoire
var visibleUnicodeRegExp = new RegExp("^" + unicodeRegExp.visible.source + "*$");
purify.visibleUnicode = function (rawValue, defaultValue) {
    if (typeof rawValue === 'string' && visibleUnicodeRegExp.test(rawValue)) {
        return rawValue;
    }
    return defaultValue;
};

// Visible characters + space, full Unicode repertoire
var nonEmptyPrintableUnicodeRegExp = new RegExp("^" + unicodeRegExp.printable.source + "+$");
purify.nonEmptyPrintableUnicode = function (rawValue, defaultValue) {
    if (typeof rawValue === 'string' && nonEmptyPrintableUnicodeRegExp.test(rawValue)) {
        return rawValue;
    }
    return defaultValue;
};

// Visible characters + space, full Unicode repertoire
var printableUnicodeRegExp = new RegExp("^" + unicodeRegExp.printable.source + "*$");
purify.printableUnicode = function (rawValue, defaultValue) {
    if (typeof rawValue === 'string' && printableUnicodeRegExp.test(rawValue)) {
        return rawValue;
    }
    return defaultValue;
};

purify.nonEmptyVisibleAscii = function (rawValue, defaultValue) {
    if (typeof rawValue === 'string' && /^[\x21-\x7e]+$/.test(rawValue)) {
        return rawValue;
    }
    return defaultValue;
};

purify.visibleAscii = function (rawValue, defaultValue) {
    if (typeof rawValue === 'string' && /^[\x21-\x7e]*$/.test(rawValue)) {
        return rawValue;
    }
    return defaultValue;
};

purify.nonEmptyPrintableAscii = function (rawValue, defaultValue) {
    if (typeof rawValue === 'string' && /^[\x20-\x7e]+$/.test(rawValue)) {
        return rawValue;
    }
    return defaultValue;
};

purify.printableAscii = function (rawValue, defaultValue) {
    if (typeof rawValue === 'string' && /^[\x20-\x7e]*$/.test(rawValue)) {
        return rawValue;
    }
    return defaultValue;
};

purify.alphaNumeric = function (rawValue, defaultValue) {
    if (typeof rawValue === 'string' && /^[a-z0-9]*$/i.test(rawValue)) {
        return rawValue;
    } else if (typeof rawValue === 'number' && isFinite(rawValue) && !isNaN(rawValue) && rawValue === Math.floor(rawValue)) {
        return String(rawValue);
    }
    return defaultValue;
};

purify.nonEmptyAlphaNumeric = function (rawValue, defaultValue) {
    if (typeof rawValue === 'string' && /^[a-z0-9]+$/i.test(rawValue)) {
        return rawValue;
    } else if (typeof rawValue === 'number' && isFinite(rawValue) && !isNaN(rawValue) && rawValue === Math.floor(rawValue)) {
        return String(rawValue);
    }
    return defaultValue;
};

purify.alphaNumericWithDot = function (rawValue, defaultValue) {
    if (typeof rawValue === 'string' && /^[a-z0-9\.]*$/i.test(rawValue)) {
        return rawValue;
    } else if (typeof rawValue === 'number' && isFinite(rawValue) && !isNaN(rawValue)) {
        return String(rawValue);
    }
    return defaultValue;
};

purify.nonEmptyAlphaNumericWithDot = function (rawValue, defaultValue) {
    if (typeof rawValue === 'string' && /^[a-z0-9\.]+$/i.test(rawValue)) {
        return rawValue;
    } else if (typeof rawValue === 'number' && isFinite(rawValue) && !isNaN(rawValue)) {
        return String(rawValue);
    }
    return defaultValue;
};

purify.uuid = function (rawValue, defaultValue) {
    if (typeof rawValue === 'string' && oneValidation.uuid.test(rawValue)) {
        return rawValue;
    }
    return defaultValue;
};

purify.upperCaseUuid = function (rawValue, defaultValue) {
    if (typeof rawValue === 'string' && oneValidation.upperCaseUuid.test(rawValue)) {
        return rawValue;
    }
    return defaultValue;
};

purify.lowerCaseUuid = function (rawValue, defaultValue) {
    if (typeof rawValue === 'string' && oneValidation.lowerCaseUuid.test(rawValue)) {
        return rawValue;
    }
    return defaultValue;
};

purify.json = function (rawValue, defaultValue) {
    if (typeof rawValue === 'string') {
        try {
            return JSON.parse(rawValue);
        } catch (e) {}
    }
    return defaultValue;
};
