import React, { Component } from 'react';
import restclient from '../../restclient';
import Paper from '@material-ui/core/Paper';
import EventForm from '../EventForm/EventForm';
import { Bar } from 'react-chartjs-2';
import * as moment from 'moment';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import MoneyEngine from '../../services/moneyengine/moneyengine';
import Totals from '../Totals/Totals';
import Calculator from '../Calculator/Calculator';
import History from '../History/History';
import PassPhrase from '../PassPhrase/PassPhrase';
import EncryptionService from '../../services/encryption/encryptionservice';

const encryptionService = new EncryptionService();

class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      rawMoneyLogs: [],
      decryptedMoneyLogs: [],
      logToUpdate: null,
      targetDate: moment(),
      passPhrase: '',
    };
  }

  handleTargetDateChange = (targetDate) => {
    this.setState({
      targetDate,
    });
  };

  handlePassPhraseChange = (passPhraseEvent) => {
    const passPhrase = passPhraseEvent.target.value;

    this.setState({
      passPhrase,
    });

    if (passPhrase !== '') {
      console.log(passPhrase);
      const rawMoneyLogJson = this.state.rawMoneyLogs || null;

      console.log(rawMoneyLogJson);

      if (rawMoneyLogJson.length > 0) {
        const decryptedMoneyLogJson = rawMoneyLogJson.map((log) =>
          encryptionService.decryptMoneyLog(log, passPhrase)
        );

        console.log(decryptedMoneyLogJson);

        this.setState({
          decryptedMoneyLogs: decryptedMoneyLogJson,
        });
      }
    }
  };

  refreshMoneyLogs = async () => {
    const allLogs = await restclient.moneylog.getAllByUsername(
      this.props.username
    );

    const allEncryptedMoneyLogJson = await allLogs.json();

    const allDecryptedMoneyLogs = allEncryptedMoneyLogJson.map((log) =>
      encryptionService.decryptMoneyLog(log, this.state.passPhrase)
    );

    this.setState({
      rawMoneyLogs: allEncryptedMoneyLogJson,
      decryptedMoneyLogs: allDecryptedMoneyLogs,
    });
  };

  componentDidMount = async () => {
    await this.refreshMoneyLogs();
  };

  submitNewLog = async (newLog) => {
    newLog = { username: this.props.username, ...newLog };

    const encryptedLog = encryptionService.encryptMoneyLog(
      newLog,
      this.state.passPhrase
    );

    await restclient.moneylog.submitNewLog(encryptedLog, this.props.username);

    this.refreshMoneyLogs();
    this.setState({
      logToUpdate: null,
    });
  };

  updateLog = async (newLog) => {
    newLog = { username: this.props.username, ...newLog };

    await restclient.moneylog.updateLog(newLog, this.props.username);

    this.refreshMoneyLogs();
    this.setState({
      logToUpdate: null,
    });
  };

  deleteLog = async (logId) => {
    await restclient.moneylog.delete(logId, this.props.username);

    this.refreshMoneyLogs();
    this.setState({
      logToUpdate: null,
    });
  };

  resetForm = () => {
    this.refreshMoneyLogs();
    this.setState({
      logToUpdate: null,
    });
  };

  getTotalSpent = () => {
    const allLogs = this.state.decryptedMoneyLogs.filter(
      (log) => log.log_type === 'SPENT'
    );

    const moneyEngine = new MoneyEngine();

    moneyEngine.loadEvents([...allLogs]);

    const uniqueCurrencies = [...new Set(allLogs.map((log) => log.currency))];

    const now = moment();

    const totalSpentItems = [];

    uniqueCurrencies.forEach((currency) => {
      const totalSpentNow = moneyEngine.getForCurrentMonth(currency);
      const amountPositive = totalSpentNow >= 0;

      totalSpentItems.push(
        <div
          style={{
            color: amountPositive ? 'green' : 'red',
          }}
          key={currency}
        >
          <b>{totalSpentNow + ` ${currency}`}</b>
        </div>
      );
    });

    const currentDate = now.format('MMMM DD, YYYY');

    return (
      <ListItem button dense>
        <ListItemText
          primary={currentDate}
          secondary="Total spent this month"
        />
        <div
          style={{
            textAlign: 'right',
          }}
        >
          <>{totalSpentItems}</>
        </div>
      </ListItem>
    );
  };

  getTotalAvailable = (targetDate) => {
    const allLogs = this.state.decryptedMoneyLogs;

    const moneyEngine = new MoneyEngine();

    moneyEngine.loadEvents([...allLogs]);

    const uniqueCurrencies = [...new Set(allLogs.map((log) => log.currency))];

    let now;

    if (targetDate) {
      now = moment(targetDate);
    } else {
      now = moment();
    }

    const totalItems = [];

    uniqueCurrencies.forEach((currency) => {
      const totalAvailableNow = moneyEngine.get(now, currency);
      const amountPositive = totalAvailableNow >= 0;

      if (totalAvailableNow !== 0) {
        totalItems.push(
          <div
            style={{
              color: amountPositive ? 'green' : 'red',
            }}
            key={currency}
          >
            <b>{totalAvailableNow + ` ${currency}`}</b>
          </div>
        );
      }
    });

    const currentDate = now.format('MMMM DD, YYYY');

    return (
      <ListItem button dense>
        <ListItemText primary={'Available on ' + currentDate} />
        <div
          style={{
            textAlign: 'right',
          }}
        >
          <>{totalItems}</>
        </div>
      </ListItem>
    );
  };

  getLogRows = () => {
    return this.state.decryptedMoneyLogs.map((log) => {
      const date = moment(log.created_date).format('MMMM DD, YYYY');
      const amountPositive = log.log_type === 'RECEIVED';
      const amount = log.amount + ' ' + log.currency.toUpperCase();
      const description = log.description.trim().substring(0, 40);

      return (
        <div
          key={log.id}
          onClick={() => {
            this.setState({
              logToUpdate: log,
            });
          }}
        >
          <ListItem button dense>
            <ListItemText primary={date} secondary={description} />
            <span
              style={{
                color: amountPositive ? 'green' : 'red',
                textAlign: 'right',
              }}
            >
              <b>{amountPositive ? amount : '-' + amount}</b>
            </span>
          </ListItem>
        </div>
      );
    });
  };

  getMonthlyDataset = () => {
    const spentLogs = this.state.decryptedMoneyLogs.filter(
      (log) => log.log_type === 'SPENT'
    );

    const moneyEngine = new MoneyEngine();

    moneyEngine.loadEvents([...spentLogs]);

    const monthlyDataset = moneyEngine.getMonthlyDataset();

    return (
      <Bar
        data={monthlyDataset}
        options={{
          title: {
            display: true,
            text: 'Total spent by month',
          },
          legend: {
            display: true,
            position: 'bottom',
          },
          scales: {
            yAxes: [
              {
                ticks: {
                  beginAtZero: true,
                },
              },
            ],
          },
        }}
      />
    );
  };

  render = () => {
    return (
      <main style={{ margin: '40px 0 40px 0' }}>
        <PassPhrase
          passPhrase={this.state.passPhrase}
          handlePassPhraseChange={this.handlePassPhraseChange}
        />
        <Paper style={{ padding: '10px' }}>
          <EventForm
            submitNewLog={this.submitNewLog}
            logToUpdate={this.state.logToUpdate}
            updateLog={this.updateLog}
            deleteLog={this.deleteLog}
            resetForm={this.resetForm}
          />
        </Paper>
        {this.state.decryptedMoneyLogs.length > 0 && (
          <div style={{ marginTop: '10px' }}>
            <Totals
              getTotalAvailable={this.getTotalAvailable}
              getTotalSpent={this.getTotalSpent}
              getMonthlyDataset={this.getMonthlyDataset}
            />
            <Calculator getTotalAvailable={this.getTotalAvailable} />
            <History getLogRows={this.getLogRows} />
          </div>
        )}
      </main>
    );
  };
}

export default Home;
