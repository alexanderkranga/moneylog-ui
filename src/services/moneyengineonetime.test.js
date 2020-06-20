import MoneyEngine from './moneyengine';
import moment from 'moment';

let moneyEngine;

beforeEach(() => {
  moneyEngine = new MoneyEngine();
});

describe('one time events should be calculated correctly', () => {
  test('one_time log event', () => {
    const now = moment();
    const oneTimeLog = {
      created_date: now,
      amount: 20000,
      currency: 'MDL',
      description: 'iznachalino',
      log_type: 'RECEIVED',
      log_frequency: 'ONE_TIME'
    };
    moneyEngine.loadEvents([oneTimeLog]);
    expect(moneyEngine.get(now)).toEqual(20000);
    expect(moneyEngine.get(moment())).toEqual(20000);
  });

  test('one_time log event boundary conditions', () => {
    const oneTimeLog = {
      created_date: moment(),
      amount: 20000,
      currency: 'MDL',
      description: 'iznachalino',
      log_type: 'RECEIVED',
      log_frequency: 'ONE_TIME'
    };
    moneyEngine.loadEvents([oneTimeLog]);
    expect(moneyEngine.get(moment().subtract(1, 'seconds'))).toEqual(0);
    expect(moneyEngine.get(moment().add(1, 'seconds'))).toEqual(20000);
  });
  test('two one_time log events', () => {
    const oneTimeLog = {
      created_date: moment(),
      amount: 20000,
      currency: 'MDL',
      description: 'iznachalino',
      log_type: 'RECEIVED',
      log_frequency: 'ONE_TIME'
    };
    const oneTimeLog2 = {
      created_date: moment().add(50, 'minutes'),
      amount: 200,
      currency: 'MDL',
      description: 'potom',
      log_type: 'RECEIVED',
      log_frequency: 'ONE_TIME'
    };
    moneyEngine.loadEvents([oneTimeLog, oneTimeLog2]);
    expect(moneyEngine.get(moment().subtract(1, 'seconds'))).toEqual(0);
    expect(moneyEngine.get(moment().add(1, 'seconds'))).toEqual(20000);
  });
  test('two one_time log events, test before all events', () => {
    const oneTimeLog = {
      created_date: moment(),
      amount: 20000,
      currency: 'MDL',
      description: 'iznachalino',
      log_type: 'RECEIVED',
      log_frequency: 'ONE_TIME'
    };
    const oneTimeLog2 = {
      created_date: moment().subtract(20, 'minutes'),
      amount: 200,
      currency: 'MDL',
      description: 'pered',
      log_type: 'RECEIVED',
      log_frequency: 'ONE_TIME'
    };
    moneyEngine.loadEvents([oneTimeLog, oneTimeLog2]);
    expect(moneyEngine.get(moment().subtract(1, 'seconds'))).toEqual(200);
    expect(moneyEngine.get(moment().add(1, 'seconds'))).toEqual(20200);
    expect(moneyEngine.get(moment().subtract(21, 'minutes'))).toEqual(0);
  });
});
