import moment from 'moment';

export default class MoneyEngine {
  moneyLogs;

  loadEvents = (moneyLogEvents) => {
    const mappedEvents = moneyLogEvents.map((event) => {
      if (!event.log_frequency) {
        throw new Error('log_frequency is missing');
      }

      if (event.log_frequency === 'ONE_TIME') {
        event.calculateEventValue = calculateOneTimeEventValue;
      } else if (event.log_frequency === 'RECURRING') {
        event.calculateEventValue = calculateRecurringEventValue;
      } else {
        throw new Error('Unsupported log_frequency ' + event.log_frequency);
      }

      return event;
    });
    this.moneyLogs = [...mappedEvents];
  };

  get = (datetime, currency) => {
    let finalEventValue = 0;

    this.moneyLogs
      .filter((log) => {
        if (!currency || currency === '') {
          return log;
        }
        return log.currency === currency;
      })
      .forEach((log) => {
        const eventValue = log.calculateEventValue(datetime);

        finalEventValue += eventValue;
      });
    return finalEventValue;
  };

  getForCurrentMonth = (currency) => {
    let finalEventValue = 0;

    const start = moment().startOf('month');

    this.moneyLogs
      .filter((log) => {
        if (!currency || currency === '') {
          return log;
        }
        return log.currency === currency;
      })
      .forEach((log) => {
        const eventValue = log.calculateEventValue(moment(), start);

        finalEventValue += eventValue;
      });
    return finalEventValue;
  };

  getMonthlyDataset = () => {
    const monthlyDataset = {
      labels: [],
      datasets: [],
    };

    this.moneyLogs
      .sort((a, b) => {
        if (a.created_date < b.created_date) return -1;
        if (a.created_date > b.created_date) return 1;
        return 0;
      })
      .forEach((log) => {
        const month = moment(log.created_date).format('MMMM');
        if (!monthlyDataset.labels.includes(month)) {
          monthlyDataset.labels.push(month);
        }
      });

    const mdlDataset = {
      label: 'MDL',
      backgroundColor: 'rgba(0, 256, 0,0.6)',
      borderColor: 'rgba(0,0,0,1)',
      borderWidth: 1,
      data: [],
    };
    const eurDataset = {
      label: 'EUR',
      backgroundColor: 'rgba(256,0,0,0.6)',
      borderColor: 'rgba(0,0,0,1)',
      borderWidth: 1,
      data: [],
    };
    const usdDataset = {
      label: 'USD',
      backgroundColor: 'rgba(0,0,256,0.6)',
      borderColor: 'rgba(0,0,0,1)',
      borderWidth: 1,
      data: [],
    };
    const uahDataset = {
      label: 'UAH',
      backgroundColor: 'rgba(256,256,0,0.6)',
      borderColor: 'rgba(0,0,0,1)',
      borderWidth: 1,
      data: [],
    };

    this.moneyLogs.forEach((log) => {
      const month = moment(log.created_date).format('MMMM');

      const position = monthlyDataset.labels.indexOf(month);

      if (log.currency === 'MDL') {
        mdlDataset.data[position] =
          (mdlDataset.data[position] || 0) + log.amount;
      }

      if (log.currency === 'EUR') {
        eurDataset.data[position] =
          (eurDataset.data[position] || 0) + log.amount;
      }

      if (log.currency === 'USD') {
        usdDataset.data[position] =
          (usdDataset.data[position] || 0) + log.amount;
      }

      if (log.currency === 'UAH') {
        uahDataset.data[position] =
          (uahDataset.data[position] || 0) + log.amount;
      }
    });

    if (mdlDataset.data.length > 0) {
      monthlyDataset.datasets.push(mdlDataset);
    }

    if (eurDataset.data.length > 0) {
      monthlyDataset.datasets.push(eurDataset);
    }

    if (usdDataset.data.length > 0) {
      monthlyDataset.datasets.push(usdDataset);
    }

    if (uahDataset.data.length > 0) {
      monthlyDataset.datasets.push(uahDataset);
    }

    return monthlyDataset;
  };
}

const calculateOneTimeEventValue = function (end_datetime, start_datetime) {
  if (moment(end_datetime).isSameOrAfter(this.created_date)) {
    if (start_datetime) {
      console.log(start_datetime);
      if (moment(start_datetime).isSameOrBefore(this.created_date)) {
        return this.log_type === 'SPENT' ? this.amount * -1 : this.amount;
      }
    } else {
      console.log(this.amount);
      return this.log_type === 'SPENT' ? this.amount * -1 : this.amount;
    }
  }
  return 0;
};

const calculateRecurringEventValue = function (datetime) {
  let reallyCalculateUntil;

  if (
    this.end_time &&
    moment(this.end_time).isSameOrBefore(moment(this.created_date))
  ) {
    reallyCalculateUntil = moment(this.end_time);
  } else {
    reallyCalculateUntil = datetime;
  }

  let b = reallyCalculateUntil.diff(
    moment(this.start_time),
    this.repeat_period.toLowerCase()
  );

  let eventValue;

  if (b === 0) {
    if (moment(reallyCalculateUntil).isBefore(this.start_time)) {
      return 0;
    }
    eventValue = this.amount;
  } else {
    b = (b + 1) / this.repeat_frequency;

    eventValue = b * this.amount;
  }

  return this.log_type === 'SPENT' ? eventValue * -1 : eventValue;
};
