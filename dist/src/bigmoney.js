'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _currency = require('./currency');

var _currency2 = _interopRequireDefault(_currency);

var _big = require('big.js');

var _big2 = _interopRequireDefault(_big);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var extraCurrencies = {};

function BigMoney(intAmount, currency) {
  if (typeof currency === 'string') {
    currency = BigMoney.getCurrency(currency);
  }

  this.amount = (0, _big2.default)(intAmount);
  this.currency = currency;
  Object.freeze(this);
}

BigMoney.prototype.add = function (value) {
  var currency = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : this.currency;

  var valueNumber = value instanceof BigMoney ? value : BigMoney.parse(value, currency);

  if (!checkValues(valueNumber, this)) {
    throw new Error('Invalid Number');
  }

  return new BigMoney(this.amount.add(valueNumber.amount), this.currency);
};

BigMoney.prototype.subtract = function (value) {
  var currency = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : this.currency;

  var valueNumber = value instanceof BigMoney ? value : BigMoney.parse(value, currency);

  if (!checkValues(valueNumber, this)) {
    throw new Error('Invalid Number');
  }

  return new BigMoney(this.amount.sub(valueNumber.amount), this.currency);
};

BigMoney.prototype.multiply = function (value) {
  var currency = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : this.currency;

  var valueNumber = value instanceof BigMoney ? value : BigMoney.parse(value, currency);

  if (!checkValues(valueNumber, this)) {
    throw new Error('Invalid Number');
  }

  var power = (0, _big2.default)(10).pow(this.currency.decimal_digits);
  var amount = valueNumber.amount.div(power);

  return new BigMoney(this.amount.mul(amount), this.currency);
};

BigMoney.prototype.divide = function (value) {
  var currency = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : this.currency;

  var valueNumber = value instanceof BigMoney ? value : BigMoney.parse(value, currency);

  if (!checkValues(valueNumber, this)) {
    throw new Error('Invalid Number');
  }

  var power = (0, _big2.default)(10).pow(this.currency.decimal_digits);
  var amount = valueNumber.amount.div(power);

  return new BigMoney(this.amount.div(amount), this.currency);
};

BigMoney.prototype.compare = function (value) {
  var currency = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : this.currency;

  var valueNumber = value instanceof BigMoney ? value : BigMoney.parse(value, currency);

  if (!checkValues(valueNumber, this)) {
    throw new Error('Invalid Number');
  }

  return this.amount.cmp(valueNumber.amount);
};

BigMoney.prototype.getCurrencyCode = function () {
  return this.currency.code;
};

BigMoney.prototype.getAmount = function () {
  return +this.amount.toFixed(0);
};

BigMoney.prototype.toString = function () {
  var power = (0, _big2.default)(10).pow(this.currency.decimal_digits);
  var amount = this.amount.div(power);
  return amount.round(this.currency.decimal_digits, _big2.default.ROUND_HALF_EVEN).toFixed(this.currency.decimal_digits);
};

BigMoney.prototype.toDecimal = function () {
  return +this.toString();
};

BigMoney.prototype.toCurrencyString = function () {
  return this.toString() + " " + this.currency.code;
};

BigMoney.prototype.toLocaleString = function () {
  var locale = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 'en-US';

  return this.toDecimal().toLocaleString(locale, { style: 'currency', currency: this.currency.localeCode || this.currency.code });
};

BigMoney.prototype.toMinimalString = function () {
  var power = (0, _big2.default)(10).pow(this.currency.decimal_digits);
  var amount = this.amount.div(power);
  return amount.round(this.currency.decimal_digits, _big2.default.ROUND_HALF_EVEN).toString();
};

BigMoney.addCurrency = function (currency) {
  extraCurrencies[currency.code] = currency;
};

BigMoney.getCurrency = function (currencyCode) {
  return Object.assign({}, _currency2.default, extraCurrencies)[currencyCode];
};

BigMoney.parse = function (decimal, currency) {
  if (typeof decimal === 'string' && decimal.indexOf(' ') > 0) {
    var stringParts = decimal.split(' ');
    decimal = stringParts[0];
    currency = stringParts[1].toUpperCase();
  }

  if (typeof currency === 'string') {
    currency = BigMoney.getCurrency(currency);
  }

  if (!currency) {
    throw new Error('Invalid currency');
  }

  var amount = (0, _big2.default)(decimal);
  var power = (0, _big2.default)(10).pow(currency.decimal_digits);
  amount = amount.mul(power);
  amount = amount.round(0, _big2.default.ROUND_HALF_EVEN);

  return new BigMoney(amount, currency);
};

var checkValues = function checkValues(val1, val2) {
  if (val1.getCurrencyCode() !== val2.getCurrencyCode()) {
    throw new Error('Currencies don\'t match [' + val1.getCurrencyCode() + '] [' + val2.getCurrencyCode() + ']');
  }

  return true;
};

exports.default = BigMoney;
//# sourceMappingURL=bigmoney.js.map