import currencies from './currency';
import Big from 'big.js';

const extraCurrencies = {};

function BigMoney(intAmount, currency) {
    if(typeof currency === 'string') {
      currency = BigMoney.getCurrency(currency);
    }

    this.amount = Big(intAmount);
    this.currency = currency;
    Object.freeze(this);
}

BigMoney.prototype.add = function(value, currency = this.currency) {
  const valueNumber = value instanceof BigMoney ? value : BigMoney.parse(value, currency);

  if(!checkValues(valueNumber, this)) {
    throw new Error('Invalid Number');
  }

  return new BigMoney(this.amount.add(valueNumber.amount), this.currency);
};

BigMoney.prototype.subtract = function(value, currency = this.currency) {
  const valueNumber = value instanceof BigMoney ? value : BigMoney.parse(value, currency);

  if(!checkValues(valueNumber, this)) {
    throw new Error('Invalid Number');
  }

  return new BigMoney(this.amount.sub(valueNumber.amount), this.currency);
};

BigMoney.prototype.multiply = function(value, currency = this.currency) {
  const valueNumber = value instanceof BigMoney ? value : BigMoney.parse(value, currency);

  if(!checkValues(valueNumber, this)) {
    throw new Error('Invalid Number');
  }

  const power = Big(10).pow(this.currency.decimal_digits);
  const amount = valueNumber.amount.div(power);

  return new BigMoney(this.amount.mul(amount), this.currency);
};

BigMoney.prototype.divide = function(value, currency = this.currency) {
  const valueNumber = value instanceof BigMoney ? value : BigMoney.parse(value, currency);

  if(!checkValues(valueNumber, this)) {
    throw new Error('Invalid Number');
  }

  const power = Big(10).pow(this.currency.decimal_digits);
  const amount = valueNumber.amount.div(power);

  return new BigMoney(this.amount.div(amount), this.currency);
};

BigMoney.prototype.compare = function(value, currency = this.currency) {
  const valueNumber = value instanceof BigMoney ? value : BigMoney.parse(value, currency);

  if(!checkValues(valueNumber, this)) {
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
  const power = Big(10).pow(this.currency.decimal_digits);
  let amount = this.amount.div(power);
  return amount.round(this.currency.decimal_digits, Big.ROUND_HALF_EVEN).toFixed(this.currency.decimal_digits);
};

BigMoney.prototype.toDecimal = function() {
  return +this.toString();
};

BigMoney.prototype.toCurrencyString = function() {
  return this.toString() + " " + this.currency.code;
};

BigMoney.prototype.toLocaleString = function(locale = 'en-US') {
  return this.toDecimal().toLocaleString(locale, { style: 'currency', currency: this.currency.localeCode || this.currency.code });
};

BigMoney.prototype.toMinimalString = function() {
  const power = Big(10).pow(this.currency.decimal_digits);
  let amount = this.amount.div(power);
  return amount.round(this.currency.decimal_digits, Big.ROUND_HALF_EVEN).toString();
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
  const power = Big(10).pow(currency.decimal_digits);
  amount = amount.mul(power);
  amount = amount.round(0, Big.ROUND_HALF_EVEN);

  return new BigMoney(amount, currency);
};

const checkValues = function(val1, val2) {
  if(val1.getCurrencyCode() !== val2.getCurrencyCode()) {
    throw new Error('Currencies don\'t match [' + val1.getCurrencyCode() + '] [' + val2.getCurrencyCode() + ']');
  }

  return true;
};

export default BigMoney;
