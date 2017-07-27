'use strict';

var _mockdate = require('mockdate');

var _mockdate2 = _interopRequireDefault(_mockdate);

var _bigmoney = require('../src/bigmoney');

var _bigmoney2 = _interopRequireDefault(_bigmoney);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

describe('BigMoney', function () {
  beforeEach(function () {
    _mockdate2.default.set(1434319925275);
  });

  it('Should show USD money 50 cents', function () {
    expect(new _bigmoney2.default(50, 'USD').toString()).toEqual("0.50");
  });

  it('Should show custom currency', function () {
    var value = new _bigmoney2.default(50, {
      "symbol": "RR",
      "name": "RAD Dollar",
      "symbol_native": "$",
      "decimal_digits": 4,
      "rounding": 0,
      "code": "RAD",
      "name_plural": "RAD dollars"
    }).toCurrencyString();

    expect(value).toMatch("0.0050 RAD");
  });

  it('Half even rounding 1', function () {
    expect(_bigmoney2.default.parse("3.943 USD").toString()).toEqual("3.94");
  });

  it('Half even rounding 2', function () {
    expect(_bigmoney2.default.parse("3.947 USD").toString()).toEqual("3.95");
  });

  it('New customer currency', function () {
    _bigmoney2.default.addCurrency({
      "symbol": "MM",
      "name": "MMM Dollar",
      "symbol_native": "$",
      "decimal_digits": 3,
      "rounding": 0,
      "code": "MMM",
      "name_plural": "MMM dollars"
    });

    expect(_bigmoney2.default.parse("3.94557 MMM").toCurrencyString()).toEqual("3.946 MMM");
  });

  it('Multiplication', function () {
    expect(_bigmoney2.default.parse("4.063 USD").multiply(30).toCurrencyString()).toEqual("121.80 USD");
  });

  it('Division', function () {
    expect(_bigmoney2.default.parse("4.063 USD").divide("1.23 USD").toCurrencyString()).toEqual("3.30 USD");
  });

  it('Minimal String', function () {
    expect(_bigmoney2.default.parse("4.00 USD").toMinimalString()).toEqual("4");
  });
});
//# sourceMappingURL=testSpec.js.map