import 'date-fns';
import React, { useEffect } from 'react';
import Grid from '@material-ui/core/Grid';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import InputLabel from '@material-ui/core/InputLabel';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import DateFnsUtils from '@date-io/date-fns';
import { MuiPickersUtilsProvider, DateTimePicker } from '@material-ui/pickers';
import ClearIcon from '@material-ui/icons/Clear';
import IconButton from '@material-ui/core/IconButton';
import moment from 'moment';

const ONE_TIME_LOG_FREQUENCY = 'ONE_TIME';
const RECURRING_LOG_FREQUENCY = 'RECURRING';

export default props => {
  const DEFAULT_LOG_FREQUENCY = ONE_TIME_LOG_FREQUENCY;
  const DEFAULT_AMOUNT = '';
  const DEFAULT_LOG_TYPE = 'SPENT';
  const DEFAULT_CURRENCY = 'MDL';
  const DEFAULT_DESCRIPTION = '';
  const DEFAULT_CREATED_DATE = moment();
  const DEFAULT_START_TIME = moment();
  const DEFAULT_END_TIME = null;
  const DEFAULT_REPEAT_FREQUENCY = 1;
  const DEFAULT_REPEAT_PERIOD = 'MONTHS';

  const [logFrequency, setLogFrequency] = React.useState(DEFAULT_LOG_FREQUENCY);
  const [amount, setAmount] = React.useState(DEFAULT_AMOUNT);
  const [logType, setLogType] = React.useState(DEFAULT_LOG_TYPE);
  const [currency, setCurrency] = React.useState(DEFAULT_CURRENCY);
  const [description, setDescription] = React.useState(DEFAULT_DESCRIPTION);
  const [createdDate, setCreatedDate] = React.useState(DEFAULT_CREATED_DATE);
  const [startTime, setStartTime] = React.useState(DEFAULT_START_TIME);
  const [endTime, setEndTime] = React.useState(DEFAULT_END_TIME);
  const [repeatFrequency, setRepeatFequency] = React.useState(
    DEFAULT_REPEAT_FREQUENCY
  );
  const [repeatPeriod, setRepeatPeriod] = React.useState(DEFAULT_REPEAT_PERIOD);

  const resetEventForm = () => {
    setLogFrequency(DEFAULT_LOG_FREQUENCY);
    setAmount(DEFAULT_AMOUNT);
    setCurrency(DEFAULT_CURRENCY);
    setDescription(DEFAULT_DESCRIPTION);
    setLogType(DEFAULT_LOG_TYPE);
    setCreatedDate(DEFAULT_CREATED_DATE);
    setStartTime(moment());
    setEndTime(null);
    setRepeatFequency(DEFAULT_REPEAT_FREQUENCY);
    setRepeatPeriod(DEFAULT_REPEAT_PERIOD);
  };

  useEffect(() => {
    if (props.logToUpdate) {
      if (props.logToUpdate.log_frequency) {
        setLogFrequency(props.logToUpdate.log_frequency);
      }

      if (props.logToUpdate.amount) {
        setAmount(props.logToUpdate.amount);
      }

      if (props.logToUpdate.log_type) {
        setLogType(props.logToUpdate.log_type);
      }

      if (props.logToUpdate.description) {
        setDescription(props.logToUpdate.description);
      }

      if (props.logToUpdate.currency) {
        setCurrency(props.logToUpdate.currency);
      }

      if (props.logToUpdate.created_date) {
        setCreatedDate(moment(props.logToUpdate.created_date));
      }

      if (props.logToUpdate.start_time) {
        setStartTime(moment(props.logToUpdate.start_time));
      }

      if (props.logToUpdate.end_time) {
        setEndTime(moment(props.logToUpdate.end_time));
      }

      if (props.logToUpdate.repeat_frequency) {
        setRepeatFequency(props.logToUpdate.repeat_frequency);
      }

      if (props.logToUpdate.repeat_period) {
        setRepeatPeriod(props.logToUpdate.repeat_period);
      }
    }
  }, [props.logToUpdate]);

  const handleLogFrequencyChange = event => {
    setLogFrequency(event.target.value);
  };

  const handleAmountChange = event => {
    setAmount(event.target.value);
  };

  const handleLogTypeChange = event => {
    setLogType(event.target.value);
  };

  const handleCurrencyChange = event => {
    setCurrency(event.target.value);
  };

  const handleDescriptionChange = event => {
    setDescription(event.target.value);
  };

  const handleCreatedDateChange = createdDate => {
    setCreatedDate(createdDate);
  };

  const handleStartTimeChange = startTime => {
    setStartTime(startTime);
  };

  const handleEndTimeChange = endTime => {
    setEndTime(endTime);
  };

  const handleRepeatFrequencyChange = event => {
    setRepeatFequency(event.target.value);
  };

  const handleRepeatPeriodChange = event => {
    setRepeatPeriod(event.target.value);
  };

  const submitNewLog = () => {
    if (!createdDate) {
      setCreatedDate('Invalid date');
      return;
    }

    let newLog = {
      log_type: logType.toUpperCase(),
      description: description,
      amount: Number(amount),
      currency: currency.toUpperCase(),
      created_date: createdDate.valueOf(),
      log_frequency: logFrequency.toUpperCase()
    };

    if (newLog.log_frequency === RECURRING_LOG_FREQUENCY) {
      newLog = {
        ...newLog,
        start_time: startTime.valueOf(),
        end_time: endTime === null ? null : endTime.valueOf(),
        repeat_frequency: repeatFrequency,
        repeat_period: repeatPeriod.toUpperCase()
      };
    }

    props.submitNewLog(newLog);
    resetEventForm();
  };

  const updateLog = () => {
    if (!createdDate) {
      setCreatedDate('Invalid date');
      return;
    }

    let updatedLog = {
      id: props.logToUpdate.id,
      log_type: logType.toUpperCase(),
      description: description,
      amount: Number(amount),
      currency: currency.toUpperCase(),
      created_date: createdDate.valueOf(),
      log_frequency: logFrequency.toUpperCase()
    };

    if (updatedLog.log_frequency === 'RECURRING') {
      updatedLog = {
        ...updatedLog,
        start_time: startTime.valueOf(),
        end_time: endTime === null ? null : endTime.valueOf(),
        repeat_frequency: repeatFrequency,
        repeat_period: repeatPeriod.toUpperCase()
      };
    }

    props.updateLog(updatedLog);
    resetEventForm();
  };

  const deleteLog = () => {
    props.deleteLog(props.logToUpdate.id);
    resetEventForm();
  };

  const resetForm = () => {
    props.resetForm();
    resetEventForm();
  };

  return (
    <Grid container spacing={2} direction="column" justify="center">
      <Grid item xs={12}>
        <FormControl style={{ width: '100%' }}>
          <InputLabel id="eventFrequencySelect">Frequency</InputLabel>
          <Select
            labelId="eventFrequencySelect"
            id="eventFrequencySelect"
            value={logFrequency}
            onChange={handleLogFrequencyChange}
          >
            <MenuItem value={ONE_TIME_LOG_FREQUENCY}>One time</MenuItem>
            <MenuItem value={RECURRING_LOG_FREQUENCY}>Recurring</MenuItem>
          </Select>
        </FormControl>
      </Grid>
      <Grid item xs={12}>
        <FormControl style={{ width: '100%' }}>
          <InputLabel id="currencyLabelSelect">Currency</InputLabel>
          <Select
            labelId="currencyLabelSelect"
            id="currencySelect"
            value={currency}
            onChange={handleCurrencyChange}
          >
            <MenuItem value="MDL">MDL</MenuItem>
            <MenuItem value="USD">USD</MenuItem>
            <MenuItem value="EUR">EUR</MenuItem>
            <MenuItem value="UAH">UAH</MenuItem>
          </Select>
        </FormControl>
      </Grid>
      <Grid item xs={12}>
        <TextField
          id="descriptionInput"
          name="description"
          label="Description"
          fullWidth
          value={description}
          onChange={handleDescriptionChange}
        />
      </Grid>
      <Grid item xs={12}>
        <TextField
          id="amountInput"
          name="amount"
          label="Amount"
          type="number"
          fullWidth
          value={amount}
          onChange={handleAmountChange}
        />
      </Grid>
      {logFrequency === ONE_TIME_LOG_FREQUENCY ? (
        <MuiPickersUtilsProvider utils={DateFnsUtils}>
          <Grid item xs={12}>
            <DateTimePicker
              format="MM/dd/yyyy HH:mm"
              id="dateInput"
              fullWidth
              label="Date"
              value={createdDate}
              onChange={handleCreatedDateChange}
              showTodayButton
            />
          </Grid>
        </MuiPickersUtilsProvider>
      ) : (
        <MuiPickersUtilsProvider utils={DateFnsUtils}>
          <Grid item xs={12}>
            <DateTimePicker
              format="MM/dd/yyyy HH:mm"
              fullWidth
              label="Start time"
              value={startTime}
              onChange={handleStartTimeChange}
            />
          </Grid>
          <Grid item xs={12}>
            <DateTimePicker
              format="MM/dd/yyyy HH:mm"
              fullWidth
              label="End time"
              value={endTime}
              onChange={handleEndTimeChange}
              clearable
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Repeat every"
              type="number"
              value={repeatFrequency}
              onChange={handleRepeatFrequencyChange}
              fullWidth
            />
            <FormControl style={{ width: '100%' }}>
              <Select value={repeatPeriod} onChange={handleRepeatPeriodChange}>
                <MenuItem value="YEARS">Years</MenuItem>
                <MenuItem value="MONTHS">Months</MenuItem>
                <MenuItem value="DAYS">Days</MenuItem>
                <MenuItem value="HOURS">Hours</MenuItem>
              </Select>
            </FormControl>
          </Grid>
        </MuiPickersUtilsProvider>
      )}

      <Grid container item xs={12} justify="center">
        <RadioGroup
          aria-label="eventType"
          name="eventType"
          value={logType}
          onChange={handleLogTypeChange}
          row
        >
          <FormControlLabel
            value="SPENT"
            control={<Radio color="primary" />}
            label="Spent"
            labelPlacement="start"
          />
          <FormControlLabel
            value="RECEIVED"
            control={<Radio color="primary" />}
            label="Received"
            labelPlacement="start"
          />
        </RadioGroup>
      </Grid>
      <Grid item>
        <Grid container item xs={12} justify="space-evenly">
          <Button variant="contained" color="primary" onClick={submitNewLog}>
            Create
          </Button>
          {props.logToUpdate && (
            <React.Fragment>
              <Button variant="outlined" color="default" onClick={updateLog}>
                Update
              </Button>
              <Button variant="outlined" color="secondary" onClick={deleteLog}>
                Delete
              </Button>
              <IconButton aria-label="cancel" onClick={resetForm}>
                <ClearIcon fontSize="default" color="secondary" />
              </IconButton>
            </React.Fragment>
          )}
        </Grid>
      </Grid>
    </Grid>
  );
};
