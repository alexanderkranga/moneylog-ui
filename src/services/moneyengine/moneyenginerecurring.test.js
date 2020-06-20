import MoneyEngine from './moneyengine';
import moment from 'moment';

let moneyEngine;

beforeEach(() => {
  moneyEngine = new MoneyEngine();
});

describe('recurring events should be calculated correctly', () => {
  test('one recurring event', () => {
    const recurringLog = {
      start_time: moment().subtract(2, 'months').subtract(1, 'days'),
      end_time: null,
      repeat_frequency: 1,
      repeat_period: 'MONTHS',
      amount: 70000,
      currency: 'MDL',
      description: 'salary',
      log_type: 'RECEIVED',
      log_frequency: 'RECURRING',
    };

    moneyEngine.loadEvents([recurringLog]);

    expect(moneyEngine.get(moment())).toEqual(210000);
  });

  test('one recurring event, calculate until', () => {
    const recurringLog = {
      start_time: moment(),
      end_time: null,
      repeat_frequency: 1,
      repeat_period: 'MONTHS',
      amount: 70000,
      currency: 'MDL',
      description: 'salary',
      log_type: 'RECEIVED',
      log_frequency: 'RECURRING',
    };

    moneyEngine.loadEvents([recurringLog]);

    expect(moneyEngine.get(moment().subtract(1, 'DAYS'))).toEqual(0);
  });

  test('one recurring event, calculate for two months', () => {
    const recurringLog = {
      start_time: moment('2020-04-01'),
      end_time: null,
      repeat_frequency: 1,
      repeat_period: 'MONTHS',
      amount: 70000,
      currency: 'MDL',
      description: 'salary',
      log_type: 'RECEIVED',
      log_frequency: 'RECURRING',
    };

    moneyEngine.loadEvents([recurringLog]);

    expect(
      moneyEngine.get(moment('2020-04-01').add(2, 'MONTHS').add(1, 'SECONDS'))
    ).toEqual(210000);
  });

  test('one recurring event start tomorrow', () => {
    const recurringLog = {
      start_time: moment().add(1, 'days'),
      end_time: null,
      repeat_frequency: 1,
      repeat_period: 'MONTHS',
      amount: 70000,
      currency: 'MDL',
      description: 'salary',
      log_type: 'RECEIVED',
      log_frequency: 'RECURRING',
    };

    moneyEngine.loadEvents([recurringLog]);

    expect(moneyEngine.get(moment())).toEqual(0);
  });

  test('one recurring event 2', () => {
    const recurringLog = {
      start_time: moment().subtract(20, 'days'),
      end_time: null,
      repeat_frequency: 1,
      repeat_period: 'MONTHS',
      amount: 70000,
      currency: 'MDL',
      description: 'salary',
      log_type: 'RECEIVED',
      log_frequency: 'RECURRING',
    };

    moneyEngine.loadEvents([recurringLog]);

    expect(moneyEngine.get(moment())).toEqual(70000);
  });

  test('one recurring event 3', () => {
    const recurringLog = {
      start_time: moment().subtract(40, 'days'),
      end_time: null,
      repeat_frequency: 1,
      repeat_period: 'MONTHS',
      amount: 70000,
      currency: 'MDL',
      description: 'salary',
      log_type: 'RECEIVED',
      log_frequency: 'RECURRING',
    };

    moneyEngine.loadEvents([recurringLog]);

    expect(moneyEngine.get(moment())).toEqual(140000);
  });

  test('two recurring events', () => {
    const recurringLog = {
      start_time: moment().subtract(2, 'months').subtract(1, 'days'),
      end_time: null,
      repeat_frequency: 1,
      repeat_period: 'MONTHS',
      amount: 70000,
      currency: 'MDL',
      description: 'salary',
      log_type: 'RECEIVED',
      log_frequency: 'RECURRING',
    };

    const recurringLog2 = {
      start_time: moment().subtract(2, 'months'),
      end_time: null,
      repeat_frequency: 1,
      repeat_period: 'MONTHS',
      amount: 10000,
      currency: 'MDL',
      description: 'kvartplata',
      log_type: 'SPENT',
      log_frequency: 'RECURRING',
    };

    moneyEngine.loadEvents([recurringLog, recurringLog2]);

    expect(moneyEngine.get(moment())).toEqual(180000);
  });

  test('two recurring events 2', () => {
    const recurringLog = {
      start_time: moment().subtract(2, 'months').subtract(1, 'days'),
      end_time: null,
      repeat_frequency: 1,
      repeat_period: 'MONTHS',
      amount: 70000,
      currency: 'MDL',
      description: 'salary',
      log_type: 'RECEIVED',
      log_frequency: 'RECURRING',
    };

    const recurringLog2 = {
      start_time: moment().subtract(2, 'months'),
      end_time: null,
      repeat_frequency: 1,
      repeat_period: 'MONTHS',
      amount: 10000,
      currency: 'MDL',
      description: 'kvartplata',
      log_type: 'SPENT',
      log_frequency: 'RECURRING',
    };

    moneyEngine.loadEvents([recurringLog, recurringLog2]);

    expect(moneyEngine.get(moment().subtract(1, 'SECONDS'))).toEqual(190000);
  });

  test('two recurring events 2', () => {
    const recurringLog = {
      start_time: moment().subtract(2, 'months').subtract(1, 'days'),
      end_time: null,
      repeat_frequency: 1,
      repeat_period: 'MONTHS',
      amount: 70000,
      currency: 'MDL',
      description: 'salary',
      log_type: 'RECEIVED',
      log_frequency: 'RECURRING',
    };

    const recurringLog2 = {
      start_time: moment().subtract(2, 'months'),
      end_time: null,
      repeat_frequency: 1,
      repeat_period: 'MONTHS',
      amount: 10000,
      currency: 'MDL',
      description: 'kvartplata',
      log_type: 'SPENT',
      log_frequency: 'RECURRING',
    };

    moneyEngine.loadEvents([recurringLog, recurringLog2]);

    expect(
      moneyEngine.get(moment().subtract(1, 'days').subtract(1, 'SECONDS'))
    ).toEqual(120000);
  });

  test('two recurring events boundary conditions', () => {
    const recurringLog = {
      start_time: moment().subtract(2, 'months').subtract(1, 'days'),
      end_time: null,
      repeat_frequency: 1,
      repeat_period: 'MONTHS',
      amount: 70000,
      currency: 'MDL',
      description: 'salary',
      log_type: 'RECEIVED',
      log_frequency: 'RECURRING',
    };

    const recurringLog2 = {
      start_time: moment().subtract(2, 'months'),
      end_time: null,
      repeat_frequency: 1,
      repeat_period: 'MONTHS',
      amount: 10000,
      currency: 'MDL',
      description: 'kvartplata',
      log_type: 'SPENT',
      log_frequency: 'RECURRING',
    };

    moneyEngine.loadEvents([recurringLog, recurringLog2]);

    expect(moneyEngine.get(moment().add(1, 'seconds'))).toEqual(180000);
    expect(moneyEngine.get(moment().subtract(1, 'seconds'))).toEqual(190000);
  });
});
