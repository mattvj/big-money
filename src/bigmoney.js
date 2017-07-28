import currencies from './currency';
import Big from 'big.js';

const extraCurrencies = {};

function BigMoney(amount, currency) {
    if(typeof currency === 'string') {
      currency = BigMoney.getCurrency(currency);
    }

    this.amount = Big(amount);
    this.currency = currency;
    Object.freeze(this);
}

BigMoney.prototype.add = function(value, currency = this.currency) {
  const valueNumber = value instanceof BigMoney ? value : BigMoney.parse(value, currency);

  if(!checkCurrencies(currency, this.currency)) {
    throw new Error('Invalid Number');
  }

  return new BigMoney(this.amount.add(valueNumber.amount), this.currency);
};

BigMoney.prototype.subtract = function(value, currency = this.currency) {
  const valueNumber = value instanceof BigMoney ? value : BigMoney.parse(value, currency);

  if(!checkCurrencies(currency, this.currency)) {
    throw new Error('Invalid Number');
  }

  return new BigMoney(this.amount.sub(valueNumber.amount), this.currency);
};

BigMoney.prototype.multiply = function(value, currency = this.currency) {
  let valueNumber = value instanceof BigMoney ? value : BigMoney.parse(value, currency);

  if(!checkCurrencies(currency, this.currency)) {
    throw new Error('Invalid Number');
  }

  return new BigMoney(this.amount.mul(valueNumber.amount), this.currency);
};

BigMoney.prototype.divide = function(value, currency = this.currency) {
  const valueNumber = value instanceof BigMoney ? value : BigMoney.parse(value, currency);

  if(!checkCurrencies(currency, this.currency)) {
    throw new Error('Invalid Number');
  }

  return new BigMoney(this.amount.div(valueNumber.amount), this.currency);
};

BigMoney.prototype.compare = function(value, currency = this.currency) {
  const valueNumber = value instanceof BigMoney ? value : BigMoney.parse(value, currency);

  if(!checkCurrencies(currency, this.currency)) {
    throw new Error('Invalid Number');
  }

  return this.amount.cmp(valueNumber.amount);
};

BigMoney.prototype.getCurrencyCode = function() {
  return this.currency.code;
};

BigMoney.prototype.getAmount = function() {
  return +this.amount.toFixed(0);
};

BigMoney.prototype.toString = function() {
  return this.amount.toFixed(this.currency.decimal_digits);
};

BigMoney.prototype.toDecimal = function() {
  return +this.toString();
};

BigMoney.prototype.toBigDecimal = function() {
  return this.amount;
};

BigMoney.prototype.toCents = function() {
  const power = Big(10).pow(this.currency.decimal_digits);
  const noPrecision = this.amount.mul(power);
  return noPrecision.toFixed(0);
};

BigMoney.prototype.toCurrencyString = function() {
  return this.toString() + " " + this.currency.code;
};

BigMoney.prototype.toLocaleString = function(locale = 'en-US') {
  return this.toDecimal().toLocaleString(locale, { style: 'currency', currency: this.currency.localeCode || this.currency.code });
};

BigMoney.prototype.toMinimalString = function() {
  return this.amount.round(this.currency.decimal_digits, Big.ROUND_HALF_EVEN).toString();
};

BigMoney.addCurrency = function(currency) {
  extraCurrencies[currency.code] = currency;
};

BigMoney.getCurrency = function(currencyCode) {
  return Object.assign({}, currencies, extraCurrencies)[currencyCode];
};

BigMoney.parse = function(decimal, currency) {
  if (typeof decimal === 'string' && decimal.indexOf(' ') > 0) {
    const stringParts = decimal.split(' ');
    decimal = stringParts[0];
    currency = stringParts[1].toUpperCase();
  }

  if (typeof currency === 'string') {
    currency = BigMoney.getCurrency(currency);
  }

  if (!currency) {
    throw new Error('Invalid currency');
  }

  let amount = Big(decimal);
  amount = amount.round(currency.decimal_digits, Big.ROUND_HALF_EVEN);

  return new BigMoney(amount, currency);
};

BigMoney.fromCents = function(integer, currency) {
  if (typeof currency === 'string') {
    currency = BigMoney.getCurrency(currency);
  }

  if (!currency) {
    throw new Error('Invalid currency');
  }

  let amount = Big(integer);
  const power = Big(10).pow(currency.decimal_digits);

  amount = amount.div(power).round(currency.decimal_digits, Big.ROUND_HALF_EVEN);

  return new BigMoney(amount, currency);
};

const checkCurrencies = function(currency1, currency2) {
  if (typeof currency1 !== 'string') {
    currency1 = currency1.code;
  }

  if (typeof currency2 !== 'string') {
    currency2 = currency2.code;
  }

  if(currency1 !== currency2) {
    throw new Error('Currencies don\'t match [' + currency1 + '] [' + currency2 + ']');
  }

  return true;
};

export default BigMoney;
