/*globals window, it, describe*/
var purify = typeof window !== 'undefined' ? window.purify : require('../lib/purify');
var unexpected = typeof window !== 'undefined' ? window.weknowhow.expect : require('unexpected');

var bogusDefaultValue = {};

function equalsWithEpsilon(valueToCompareTo, epsilon) {
    if (typeof epsilon === 'undefined') {
        epsilon = 1e-9;
    }
    return function (value) {
        return Math.abs(valueToCompareTo - value) < epsilon;
    };
}

describe('#purify', function () {
    var expect = unexpected.clone()
        .addAssertion('[not] to allow', function (expect, subject, valueToValidate, expectedOutputValue) {
            var methodArgs = [valueToValidate, bogusDefaultValue],
                methodName = subject;
            if (Array.isArray(methodName)) {
                Array.prototype.splice.apply(methodArgs, [1, 0].concat(methodName.slice(1)));
                methodName = methodName[0];
            }
            var result = purify[methodName].apply(purify, methodArgs);

            if (arguments.length > 3) {
                if (typeof expectedOutputValue === 'function') {
                    expect(expectedOutputValue(result), '[not] to be truthy');
                } else {
                    expect(result, 'to equal', expectedOutputValue);
                }
            } else {
                // Unexpected will reverse this if this.flags.not is set
                expect(result, '[!not] to equal', bogusDefaultValue);
            }
        });

    describe('#boolean()', function () {
        it('should accept valid input', function () {
            expect('boolean', 'to allow', '1');
            expect('boolean', 'to allow', 'on');
            expect('boolean', 'to allow', '1', true);
            expect('boolean', 'to allow', 'on', true);
            expect('boolean', 'to allow', 'true', true);
            expect('boolean', 'to allow', 'yes', true);
            expect('boolean', 'to allow', '0', false);
            expect('boolean', 'to allow', 'off', false);
            expect('boolean', 'to allow', 'false', false);
            expect('boolean', 'to allow', false, false);
            expect('boolean', 'to allow', 'no', false);
            expect('boolean', 'to allow', true, true);
        });

        it('should reject invalid input', function () {
            expect('boolean', 'not to allow', '');
            expect('boolean', 'not to allow', 'foobarquux');
        });
    });

    describe('#email()', function () {
        it('should accept valid input', function () {
            // Non-IDN domains
            expect('email', 'to allow', 'andreas@centersurf.net', 'andreas@centersurf.net');
            expect('email', 'to allow', 'andreas@centersurf.quuxbar', 'andreas@centersurf.quuxbar');

            // Punycode non-punycoded IDN domains
            expect('email', 'to allow', 'andreas@cæntersurf.net', 'andreas@xn--cntersurf-g3a.net');
            expect('email', 'to allow', 'andreas@cæntersurf.quuxbar', 'andreas@xn--cntersurf-g3a.quuxbar');

            // Already punycoded IDN domains
            expect('email', 'to allow', 'andreas@xn--cntersurf-g3a.net', 'andreas@xn--cntersurf-g3a.net');
            expect('email', 'to allow', 'andreas@xn--cntersurf-g3a.quuxbar', 'andreas@xn--cntersurf-g3a.quuxbar');

            // Mixed-case local parts allowed
            expect('email', 'to allow', 'ANDreas@centersurf.net', 'ANDreas@centersurf.net');
            expect('email', 'to allow', 'AnDrEaS@centersurf.quuxbar', 'AnDrEaS@centersurf.quuxbar');
            // Mixed case domain parts get lowercased
            expect('email', 'to allow', 'andreas@CENTERSURF.net', 'andreas@centersurf.net');
        });

        it('should reject invalid input', function () {
            expect('email', 'not to allow', '');
            expect('email', 'not to allow', '\x00andreas@centersurf.net');
            expect('email', 'not to allow', 'foo@bar.xn--no');
            expect('email', 'not to allow', 'foo@bar.xn--nod');
            expect('email', 'not to allow', 'andræas@centersurf.quuxbar');
        });
    });

    describe('#emailIdn()', function () {
        it('should accept valid input', function () {
            // Non-IDN domains
            expect('emailIdn', 'to allow', 'andreas@centersurf.net', 'andreas@centersurf.net');
            expect('emailIdn', 'to allow', 'andreas@centersurf.quuxbar', 'andreas@centersurf.quuxbar');

            // Already non-punycoded IDN domains
            expect('emailIdn', 'to allow', 'andreas@cæntersurf.net', 'andreas@cæntersurf.net');
            expect('emailIdn', 'to allow', 'andreas@cæntersurf.quuxbar', 'andreas@cæntersurf.quuxbar');

            // Decode punycoded IDN domains
            expect('emailIdn', 'to allow', 'andreas@xn--cntersurf-g3a.net', 'andreas@cæntersurf.net');
            expect('emailIdn', 'to allow', 'andreas@xn--cntersurf-g3a.quuxbar', 'andreas@cæntersurf.quuxbar');

            // Mixed-case local parts allowed
            expect('email', 'to allow', 'ANDreas@centersurf.net', 'ANDreas@centersurf.net');
            expect('email', 'to allow', 'AnDrEaS@centersurf.quuxbar', 'AnDrEaS@centersurf.quuxbar');
            // Mixed case domain parts get lowercased
            expect('email', 'to allow', 'andreas@CENTERSURF.net', 'andreas@centersurf.net');
        });

        it('should reject invalid input', function () {
            expect('emailIdn', 'not to allow', '');
            expect('emailIdn', 'not to allow', '\x00andreas@cæntersurf.net');
            expect('emailIdn', 'not to allow', 'foo@bar.xn--no');
            expect('emailIdn', 'not to allow', 'foo@bar.xn--nod');
            expect('emailIdn', 'not to allow', 'andræas@cæntersurf.quuxbar');
        });
    });

    describe('#domain()', function () {
        it('should accept valid input', function () {
            // Non-IDN domains
            expect('domain', 'to allow', 'centersurf.net', 'centersurf.net');
            expect('domain', 'to allow', 'centersurf.quuxbar', 'centersurf.quuxbar');

            // Punycode non-punycoded IDN domains
            expect('domain', 'to allow', 'cæntersurf.net', 'xn--cntersurf-g3a.net');
            expect('domain', 'to allow', 'cæntersurf.quuxbar', 'xn--cntersurf-g3a.quuxbar');

            // Already punycoded IDN domains
            expect('domain', 'to allow', 'xn--cntersurf-g3a.net', 'xn--cntersurf-g3a.net');
            expect('domain', 'to allow', 'xn--cntersurf-g3a.quuxbar', 'xn--cntersurf-g3a.quuxbar');
        });

        it('should reject invalid input', function () {
            expect('domain', 'not to allow', '');
            expect('domain', 'not to allow', '\x00centersurf.net');
            expect('domain', 'not to allow', 'bar.xn--no');
            expect('domain', 'not to allow', 'bar.xn--nod');
            expect('domain', 'not to allow', '/!');
        });
    });

    describe('#domainIdn()', function () {
        it('should accept valid input', function () {
            // Non-IDN domains
            expect('domainIdn', 'to allow', 'centersurf.net', 'centersurf.net');
            expect('domainIdn', 'to allow', 'centersurf.quuxbar', 'centersurf.quuxbar');

            // Already non-punycoded IDN domains
            expect('domainIdn', 'to allow', 'cæntersurf.net', 'cæntersurf.net');
            expect('domainIdn', 'to allow', 'cæntersurf.quuxbar', 'cæntersurf.quuxbar');

            // Decode punycoded IDN domains
            expect('domainIdn', 'to allow', 'xn--cntersurf-g3a.net', 'cæntersurf.net');
            expect('domainIdn', 'to allow', 'xn--cntersurf-g3a.quuxbar', 'cæntersurf.quuxbar');
        });

        it('should reject invalid input', function () {
            expect('domainIdn', 'not to allow', '');
            expect('domainIdn', 'not to allow', '\x00centersurf.net');
            expect('domainIdn', 'not to allow', 'bar.xn--no');
            expect('domainIdn', 'not to allow', 'bar.xn--nod');
            expect('domainIdn', 'not to allow', '/!');
        });
    });

    describe('#url()', function () {
        it('should accept valid input', function () {
            expect('url', 'to allow', 'http://centersurf.net/');
            expect('url', 'to allow', 'http://centersurf.quuxbar/');
        });

        it('should reject invalid input', function () {
            expect('url', 'not to allow', 'http://centersurf.net/æøå');
            expect('url', 'not to allow', '\x00http://centersurf.net/');
            expect('url', 'not to allow', 'http://localhost/');
        });
    });

    describe('#urlWithLocalhost()', function () {
        it('should accept valid input', function () {
            expect('urlWithLocalhost', 'to allow', 'http://localhost/');
        });

        it('should reject invalid input', function () {
            expect('urlWithLocalhost', 'not to allow', 'quuxhttp://localhost/');
        });
    });

    describe('#integer()', function () {
        it('should accept valid input', function () {
            expect('integer', 'to allow', '123', 123);
            expect('integer', 'to allow', '123.456', 123);
            expect('integer', 'to allow', '1blabla', 1);
            expect('integer', 'to allow', 123);
            expect('integer', 'to allow', 123.456, 123);
            expect('integer', 'to allow', '01234', 1234);
            expect('integer', 'to allow', '0x1234', 0);
        });

        it('should reject invalid input', function () {
            expect('integer', 'not to allow', 'NaN');
            expect('integer', 'not to allow', NaN);
            expect('integer', 'not to allow', Infinity);
            expect('integer', 'not to allow', -Infinity);
        });
    });

    describe('#integerInRange()', function () {
        describe('with defined lower and upper bounds()', function () {
            var lowerBound = 32,
                upperBound = 100;

            it('should accept valid input', function () {
                expect(['integerInRange', lowerBound, upperBound], 'to allow', String(upperBound), upperBound);
                expect(['integerInRange', lowerBound, upperBound], 'to allow', String(lowerBound), lowerBound);
                expect(['integerInRange', lowerBound, upperBound], 'to allow', upperBound, upperBound);
                expect(['integerInRange', lowerBound, upperBound], 'to allow', lowerBound, lowerBound);
            });

            it('should reject invalid input', function () {
                expect(['integerInRange', lowerBound, upperBound], 'not to allow', upperBound + 1);
                expect(['integerInRange', lowerBound, upperBound], 'not to allow', lowerBound - 1);
                expect(['integerInRange', lowerBound, upperBound], 'not to allow', String(upperBound + 1));
                expect(['integerInRange', lowerBound, upperBound], 'not to allow', String(lowerBound - 1));
            });
        });

        describe('with only an upper bound()', function () {
            var lowerBound,
                upperBound = 100;

            it('should accept valid input', function () {
                expect(['integerInRange', lowerBound, upperBound], 'to allow', -100, -100);
                expect(['integerInRange', lowerBound, upperBound], 'to allow', '-100', -100);
                expect(['integerInRange', lowerBound, upperBound], 'to allow', upperBound, upperBound);
            });

            it('should reject invalid input', function () {
                expect(['integerInRange', lowerBound, upperBound], 'not to allow', upperBound + 1);
            });
        });

        describe('with only a lower bound()', function () {
            var lowerBound = 10,
                upperBound;

            it('should accept valid input', function () {
                expect(['integerInRange', lowerBound, upperBound], 'to allow', 100000);
                expect(['integerInRange', lowerBound, upperBound], 'to allow', '100000', 100000);
            });
            it('should reject invalid input', function () {
                expect(['integerInRange', lowerBound, upperBound], 'not to allow', String(lowerBound - 1));
            });
        });

        describe('with no bounds()', function () {
            var lowerBound = 10,
                upperBound;

            it('should accept valid input', function () {
                expect(['integerInRange', lowerBound, upperBound], 'to allow', 100000);
                expect(['integerInRange', lowerBound, upperBound], 'to allow', '100000', 100000);
            });

            it('should reject invalid input', function () {
                expect(['integerInRange', lowerBound, upperBound], 'not to allow', 'abc');
            });
        });
    });

    describe('#positiveInteger()', function () {
        it('should accept valid input', function () {
            expect('positiveInteger', 'to allow', '99', 99);
            expect('positiveInteger', 'to allow', '+1', 1);
            expect('positiveInteger', 'to allow', '4.6', 4);
            expect('positiveInteger', 'to allow', 1);
            expect('positiveInteger', 'to allow', 99);
        });

        it('should reject invalid input', function () {
            expect('positiveInteger', 'not to allow', 0);
            expect('positiveInteger', 'not to allow', -1);
            expect('positiveInteger', 'not to allow', Infinity);
            expect('positiveInteger', 'not to allow', NaN);
        });
    });

    describe('#positiveIntegerOrZero()', function () {
        it('should accept valid input', function () {
            expect('positiveIntegerOrZero', 'to allow', '99', 99);
            expect('positiveIntegerOrZero', 'to allow', '+1', 1);
            expect('positiveIntegerOrZero', 'to allow', '0', 0);
            expect('positiveIntegerOrZero', 'to allow', '4.6', 4);
            expect('positiveIntegerOrZero', 'to allow', 1);
            expect('positiveIntegerOrZero', 'to allow', 99);
            expect('positiveIntegerOrZero', 'to allow', 0);
        });

        it('should reject invalid input', function () {
            expect('positiveIntegerOrZero', 'not to allow', -1);
            expect('positiveIntegerOrZero', 'not to allow', Infinity);
            expect('positiveIntegerOrZero', 'not to allow', NaN);
        });
    });

    describe('#float()', function () {
        it('should accept valid input', function () {
            expect('float', 'to allow', '99', 99);
            expect('float', 'to allow', '+1', 1);
            expect('float', 'to allow', '+1.56',  equalsWithEpsilon(1.56));
            expect('float', 'to allow', '0', 0);
            expect('float', 'to allow', '4.6', equalsWithEpsilon(4.6));
            expect('float', 'to allow', '-4.6', equalsWithEpsilon(-4.6));
            expect('float', 'to allow', 1, 1);
            expect('float', 'to allow', 99, 99);
            expect('float', 'to allow', 1.234, 1.234);
            expect('float', 'to allow', 0, 0);
            expect('float', 'to allow', -1, -1);
        });

        it('should reject invalid input', function () {
            expect('float', 'not to allow', Infinity);
            expect('float', 'not to allow', NaN);
        });
    });

    describe('#positiveFloat()', function () {
        it('should accept valid input', function () {
            expect('positiveFloat', 'to allow', '99', 99);
            expect('positiveFloat', 'to allow', '+1', 1);
            expect('positiveFloat', 'to allow', '+1.56', equalsWithEpsilon(1.56));
            expect('positiveFloat', 'to allow', '4.6', equalsWithEpsilon(4.6));
            expect('positiveFloat', 'to allow', 1);
            expect('positiveFloat', 'to allow', 99);
        });

        it('should reject invalid input', function () {
            expect('positiveFloat', 'not to allow', '0');
            expect('positiveFloat', 'not to allow', '-4.6');
            expect('positiveFloat', 'not to allow', 0);
            expect('positiveFloat', 'not to allow', -1);
            expect('positiveFloat', 'not to allow', Infinity);
            expect('positiveFloat', 'not to allow', NaN);
        });
    });

    describe('#positiveFloatOrZero()', function () {
        it('should accept valid input', function () {
            expect('positiveFloatOrZero', 'to allow', '99', 99);
            expect('positiveFloatOrZero', 'to allow', '+1', 1);
            expect('positiveFloatOrZero', 'to allow', '+1.56', equalsWithEpsilon(1.56));
            expect('positiveFloatOrZero', 'to allow', '0', 0);
            expect('positiveFloatOrZero', 'to allow', '4.6', equalsWithEpsilon(4.6));
            expect('positiveFloatOrZero', 'to allow', 1);
            expect('positiveFloatOrZero', 'to allow', 99);
            expect('positiveFloatOrZero', 'to allow', 0);
        });

        it('should reject invalid input', function () {
            expect('positiveFloatOrZero', 'not to allow', '-4.6');
            expect('positiveFloatOrZero', 'not to allow', -1);
            expect('positiveFloatOrZero', 'not to allow', Infinity);
            expect('positiveFloatOrZero', 'not to allow', NaN);
        });
    });

    describe('#nonEmptyVisibleUnicode()', function () {
        it('should accept valid input', function () {
            expect('nonEmptyVisibleUnicode', 'to allow', 'æøå');
            expect('nonEmptyVisibleUnicode', 'to allow', 'abc\u263adef');
        });

        it('should reject invalid input', function () {
            expect('nonEmptyVisibleUnicode', 'not to allow', '');
            expect('nonEmptyVisibleUnicode', 'not to allow', 'ab c');
            expect('nonEmptyVisibleUnicode', 'not to allow', '\x00');
            expect('nonEmptyVisibleUnicode', 'not to allow', '\x13');
        });
    });

    describe('#visibleUnicode()', function () {
        it('should accept valid input', function () {
            expect('visibleUnicode', 'to allow', '');
            expect('visibleUnicode', 'to allow', 'æøå');
            expect('visibleUnicode', 'to allow', 'abc\u263adef');
        });

        it('should reject invalid input', function () {
            expect('visibleUnicode', 'not to allow', 'ab c');
            expect('visibleUnicode', 'not to allow', '\x00');
            expect('visibleUnicode', 'not to allow', '\x13');
        });
    });

    describe('#visibleUnicode()', function () {
        it('should accept valid input', function () {
            expect('nonEmptyPrintableUnicode', 'to allow', 'æøå');
            expect('nonEmptyPrintableUnicode', 'to allow', 'abc\u263adef');
            expect('nonEmptyPrintableUnicode', 'to allow', 'ab c');
        });

        it('should reject invalid input', function () {
            expect('nonEmptyPrintableUnicode', 'not to allow', '');
            expect('nonEmptyPrintableUnicode', 'not to allow', '\x00');
            expect('nonEmptyPrintableUnicode', 'not to allow', '\x13');
        });
    });

    describe('#printableUnicode()', function () {
        it('should accept valid input', function () {
            expect('printableUnicode', 'to allow', '');
            expect('printableUnicode', 'to allow', 'æøå');
            expect('printableUnicode', 'to allow', 'abc\u263adef');
            expect('printableUnicode', 'to allow', 'ab c');
        });

        it('should reject invalid input', function () {
            expect('printableUnicode', 'not to allow', '\x00');
            expect('printableUnicode', 'not to allow', '\x13');
        });
    });

    describe('#visibleAscii()', function () {
        it('should accept valid input', function () {
            expect('visibleAscii', 'to allow', '');
        });

        it('should reject invalid input', function () {
            expect('visibleAscii', 'not to allow', 'æøå');
            expect('visibleAscii', 'not to allow', 'abc\u263adef');
            expect('visibleAscii', 'not to allow', 'ab c');
            expect('visibleAscii', 'not to allow', '\x00');
            expect('visibleAscii', 'not to allow', '\x13');
        });
    });

    describe('#nonEmptyPrintableAscii()', function () {
        it('should accept valid input', function () {
            expect('nonEmptyPrintableAscii', 'to allow', 'ab c');
        });

        it('should reject invalid input', function () {
            expect('nonEmptyPrintableAscii', 'not to allow', '');
            expect('nonEmptyPrintableAscii', 'not to allow', 'æøå');
            expect('nonEmptyPrintableAscii', 'not to allow', 'abc\u263adef');
            expect('nonEmptyPrintableAscii', 'not to allow', '\x00');
            expect('nonEmptyPrintableAscii', 'not to allow', '\x13');
        });
    });

    describe('#printableAscii()', function () {
        it('should accept valid input', function () {
            expect('printableAscii', 'to allow', '');
            expect('printableAscii', 'to allow', 'ab c');
        });

        it('should reject invalid input', function () {
            expect('printableAscii', 'not to allow', 'æøå');
            expect('printableAscii', 'not to allow', 'abc\u263adef');
            expect('printableAscii', 'not to allow', '\x00');
            expect('printableAscii', 'not to allow', '\x13');
        });
    });

    describe('#alphaNumeric()', function () {
        it('should accept valid input', function () {
            expect('alphaNumeric', 'to allow', '012345678901234567890123456789012345678901234567890');
            expect('alphaNumeric', 'to allow', 1234, '1234');
            expect('alphaNumeric', 'to allow', 'abcdef');
            expect('alphaNumeric', 'to allow', '');
        });

        it('should reject invalid input', function () {
            expect('alphaNumeric', 'not to allow', 12.34);
            expect('alphaNumeric', 'not to allow', 'abcdef_');
        });
    });

    describe('#nonEmptyAlphaNumeric()', function () {
        it('should accept valid input', function () {
            expect('nonEmptyAlphaNumeric', 'to allow', '012345678901234567890123456789012345678901234567890');
            expect('nonEmptyAlphaNumeric', 'to allow', 1234, '1234');
            expect('nonEmptyAlphaNumeric', 'to allow', 'abcdef');
        });

        it('should reject invalid input', function () {
            expect('nonEmptyAlphaNumeric', 'not to allow', 'abcdef_');
            expect('nonEmptyAlphaNumeric', 'not to allow', '');
            expect('nonEmptyAlphaNumeric', 'not to allow', 12.34);
        });
    });

    describe('#alphaNumericWithDot()', function () {
        it('should accept valid input', function () {
            expect('alphaNumericWithDot', 'to allow', '012345678901234567890123456789012345678901234567890');
            expect('alphaNumericWithDot', 'to allow', 1234, '1234');
            expect('alphaNumericWithDot', 'to allow', 12.34, '12.34');
            expect('alphaNumericWithDot', 'to allow', 'abcdef');
            expect('alphaNumericWithDot', 'to allow', 'abc.def');
            expect('alphaNumericWithDot', 'to allow', '');
        });

        it('should reject invalid input', function () {
            expect('alphaNumericWithDot', 'not to allow', 'abcdef_');
        });
    });

    describe('#nonEmptyAlphaNumericWithDot()', function () {
        it('should accept valid input', function () {
            expect('nonEmptyAlphaNumericWithDot', 'to allow', '012345678901234567890123456789012345678901234567890');
            expect('nonEmptyAlphaNumericWithDot', 'to allow', 1234, '1234');
            expect('nonEmptyAlphaNumericWithDot', 'to allow', 12.34, '12.34');
            expect('nonEmptyAlphaNumericWithDot', 'to allow', 'abcdef');
            expect('nonEmptyAlphaNumericWithDot', 'to allow', 'abc.def');
        });

        it('should reject invalid input', function () {
            expect('nonEmptyAlphaNumericWithDot', 'not to allow', 'abcdef_');
            expect('nonEmptyAlphaNumericWithDot', 'not to allow', '');
        });
    });

    describe('#uuid()', function () {
        it('should accept valid input', function () {
            expect('uuid', 'to allow', '550e8400-e29b-41d4-a716-446655440000');
            expect('uuid', 'to allow', '550E8400-E29B-41D4-A716-446655440000');
        });

        it('should reject invalid input', function () {
            expect('uuid', 'not to allow', '');
            expect('uuid', 'not to allow', '50e8400-e29b-41d4-a716-446655440000');
        });
    });

    describe('#upperCaseUuid()', function () {
        it('should accept valid input', function () {
            expect('upperCaseUuid', 'to allow', '550E8400-E29B-41D4-A716-446655440000');
        });

        it('should reject invalid input', function () {
            expect('upperCaseUuid', 'not to allow', '');
            expect('upperCaseUuid', 'not to allow', '550e8400-e29b-41d4-a716-446655440000');
            expect('upperCaseUuid', 'not to allow', '50e8400-e29b-41d4-a716-446655440000');
        });
    });

    describe('#lowerCaseUuid()', function () {
        it('should accept valid input', function () {
            expect('lowerCaseUuid', 'to allow', '550e8400-e29b-41d4-a716-446655440000');
        });

        it('should reject invalid input', function () {
            expect('lowerCaseUuid', 'not to allow', '');
            expect('lowerCaseUuid', 'not to allow', '550E8400-E29B-41D4-A716-446655440000');
            expect('lowerCaseUuid', 'not to allow', '50e8400-e29b-41d4-a716-446655440000');
        });
    });

    describe('#json()', function () {
        it('should accept valid input', function () {
            expect('json', 'to allow', '{"foo":"bar"}', {foo: 'bar'});
        });

        it('should reject invalid input', function () {
            expect('json', 'not to allow', '');
            expect('json', 'not to allow', 'qwowejv12');
            expect('json', 'not to allow', '{foo:"bar"}');
        });
    });
});
