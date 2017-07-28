import MockDate from 'mockdate';
import BigMoney from '../src/bigmoney';

describe('BigMoney', () => {
  beforeEach(() => {
    MockDate.set(1434319925275);
  });

  it('Should show USD money 50 cents', () => {
    expect(BigMoney.toPrecision(50, 'USD').toString()).toEqual("0.50");
  });

  it('Should show custom currency', () => {
      const value = BigMoney.toPrecision(50, {
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

  it('Half even rounding 1', () => {
    expect(BigMoney.parse("3.943 USD").toString()).toEqual("3.94");
  });

  it('Half even rounding 2', () => {
    expect(BigMoney.parse("3.947 USD").toString()).toEqual("3.95");
  });

  it('New customer currency', () => {
    BigMoney.addCurrency({
      "symbol": "MM",
      "name": "MMM Dollar",
      "symbol_native": "$",
      "decimal_digits": 3,
      "rounding": 0,
      "code": "MMM",
      "name_plural": "MMM dollars"
    });

    expect(BigMoney.parse("3.94557 MMM").toCurrencyString()).toEqual("3.946 MMM");
  });

  it('Multiplication', () => {
    expect(BigMoney.parse("4.063 USD").multiply(30).toCurrencyString()).toEqual("121.80 USD");
  });

  it('Division', () => {
    expect(BigMoney.parse("4.063 USD").divide("1.23 USD").toCurrencyString()).toEqual("3.30 USD");
  });

  it('Minimal String', () => {
    expect(BigMoney.parse("4.00 USD").toMinimalString()).toEqual("4");
  });

  it('Multiplication 2', () => {
    expect(BigMoney.parse("4.063 USD").multiply(BigMoney.parse("30 USD")).toCurrencyString()).toEqual("121.80 USD");
  });

  it('Multiplication 3', () => {
    expect(BigMoney.parse("4.063 USD").multiply(BigMoney.parse("30 CAD").divide(100)).toCurrencyString()).toEqual("1.22 USD");
  });

  it('Multiplication 4', () => {
    expect(BigMoney.parse("4.063 USD").multiply(BigMoney.parse("30 CAD"), 'USD').toCurrencyString()).toEqual("121.80 USD");
  });
});
