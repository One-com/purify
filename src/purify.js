var oneValidation = require('one-validation');
var punycode = require('punycode');
var unicodeRegExp = require('unicoderegexp');

module.exports = (function () {
    var purify = {};

    purify.boolean = function (rawValue, defaultValue) {
        if (typeof rawValue === 'boolean') {
            return rawValue;
        } else if (typeof rawValue === 'string') {
            var isTrue  = /^(?:1|on|true|yes)$/i.test(rawValue),
                isFalse = /^(?:0|off|false|no)$/i.test(rawValue);
            return isTrue ? true : (isFalse ? false : defaultValue);
        }
        return defaultValue;
    };

    purify.email = purify.emailAddress = function (rawValue, defaultValue) {
        // Should return an email with the domain part in its punycoded form regardless of input
        var fragments,
            encodedEmail,
            encodedDomain;

        try {
            if (typeof rawValue === 'string' && oneValidation.emailIdn.test(rawValue)) {
                fragments = rawValue.split('@');
                encodedDomain = fragments.length === 2 && punycode.toASCII(fragments[1]).toLowerCase();
                var decodedDomain = punycode.toUnicode(encodedDomain); // Makes sure invalid domains like foo.xn--no aren't allowed

                if (!(/\.[^\.]{2,}$/.test(decodedDomain))) {
                    encodedDomain = undefined; // Sorry, one-letter TLDs still aren't allowed
                }
            }
        } catch (e) {
            encodedDomain = undefined;
        } finally {
            encodedEmail = encodedDomain && fragments[0] + '@' + encodedDomain;
            if (typeof encodedEmail === 'string' && oneValidation.email.test(encodedEmail)) {
                return encodedEmail;
            } else {
                return defaultValue;
            }
        }
    };

    purify.emailIdn = purify.emailAddressIdn = function (rawValue, defaultValue) {
        // Should return an email with the domain part in its non-punycoded form regardless of input
        var fragments,
            decodedDomain,
            decodedEmail;

        try {
            if (typeof rawValue === 'string' && oneValidation.emailIdn.test(rawValue)) {
                fragments = rawValue.split('@');
                decodedDomain = fragments.length === 2 && punycode.toUnicode(fragments[1]).toLowerCase();

                if (!(/\.[^\.]{2,}$/.test(decodedDomain))) {
                    decodedDomain = undefined; // Sorry, one-letter TLDs still aren't allowed
                }
            }
        } catch (e) {
            decodedDomain = undefined;
        } finally {
            decodedEmail = decodedDomain && fragments[0] + '@' + decodedDomain;
            if (typeof decodedEmail === 'string' && oneValidation.emailIdn.test(decodedEmail)) {
                return decodedEmail;
            } else {
                return defaultValue;
            }
        }
    };

    purify.domain = purify.domainName = function (rawValue, defaultValue) {
        // Should return a domain in its punycoded form regardless of input
        var encodedDomain;
        try {
            if (typeof rawValue === 'string' && oneValidation.domainIdn.test(rawValue)) {
                encodedDomain = punycode.toASCII(rawValue.toLowerCase());
                var decodedDomain = punycode.toUnicode(encodedDomain); // Makes sure that things like foo.xn--no aren't allowed

                if (!(/\.[^\.]{2,}$/.test(decodedDomain))) {
                    encodedDomain = undefined; // Sorry, one-letter TLDs still aren't allowed
                }
            }
        } catch (e) {
            encodedDomain = undefined;
        } finally {
            if (typeof encodedDomain === 'string' && oneValidation.domain.test(encodedDomain)) {
                return encodedDomain;
            } else {
                return defaultValue;
            }
        }
    };

    purify.domainIdn = purify.domainNameIdn = function (rawValue, defaultValue) {
        // Should return a domain in its non-punycoded form regardless of input
        var decodedDomain;
        try {
            if (typeof rawValue === 'string' && oneValidation.domainIdn.test(rawValue)) {
                decodedDomain = punycode.toUnicode(rawValue.toLowerCase());

                if (!(/\.[^\.]{2,}$/.test(decodedDomain))) {
                    decodedDomain = undefined; // Sorry, one-letter TLDs still aren't allowed
                }
            }
        } catch (e) {
            decodedDomain = undefined;
        } finally {
            if (typeof decodedDomain === 'string' && oneValidation.domainIdn.test(decodedDomain)) {
                return decodedDomain;
            } else {
                return defaultValue;
            }
        }
    };

    purify.url = function (rawValue, defaultValue) {
        if (typeof rawValue === 'string' && oneValidation.httpUrl.test(rawValue)) {
            return rawValue;
        }
        return defaultValue;
    };

    var urlWithLocalhostRegExp = new RegExp('^(?:' + oneValidation.createHttpishUrlRegExp({scheme: /https?/, localhost: true}).source + ')$');

    purify.urlWithLocalhost = function (rawValue, defaultValue) {
        if (typeof rawValue === 'string' && urlWithLocalhostRegExp.test(rawValue)) {
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
    var nonEmptyVisibleUnicodeRegExp = new RegExp('^' + unicodeRegExp.visible.source + '+$');
    purify.nonEmptyVisibleUnicode = function (rawValue, defaultValue) {
        if (typeof rawValue === 'string' && nonEmptyVisibleUnicodeRegExp.test(rawValue)) {
            return rawValue;
        }
        return defaultValue;
    };

    // Visible characters, full Unicode repertoire
    var visibleUnicodeRegExp = new RegExp('^' + unicodeRegExp.visible.source + '*$');
    purify.visibleUnicode = function (rawValue, defaultValue) {
        if (typeof rawValue === 'string' && visibleUnicodeRegExp.test(rawValue)) {
            return rawValue;
        }
        return defaultValue;
    };

    // Visible characters + space, full Unicode repertoire
    var nonEmptyPrintableUnicodeRegExp = new RegExp('^' + unicodeRegExp.printable.source + '+$');
    purify.nonEmptyPrintableUnicode = function (rawValue, defaultValue) {
        if (typeof rawValue === 'string' && nonEmptyPrintableUnicodeRegExp.test(rawValue)) {
            return rawValue;
        }
        return defaultValue;
    };

    // Visible characters + space, full Unicode repertoire
    var printableUnicodeRegExp = new RegExp('^' + unicodeRegExp.printable.source + '*$');
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

    return purify;
})();
