import 'date-fns';
import React from 'react';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import { MuiPickersUtilsProvider, DateTimePicker } from '@material-ui/pickers';
import DateFnsUtils from '@date-io/date-fns';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import Grid from '@material-ui/core/Grid';
import * as moment from 'moment';

export default (props) => {
  const DEFAULT_TARGET_DATE = moment();

  const [targetDate, setTargetDate] = React.useState(DEFAULT_TARGET_DATE);

  return (
    <ExpansionPanel>
      <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
        <Typography>Calculator</Typography>
      </ExpansionPanelSummary>
      <ExpansionPanelDetails>
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            width: '100%',
          }}
        >
          <MuiPickersUtilsProvider utils={DateFnsUtils}>
            <Grid item xs={12}>
              <DateTimePicker
                format="MM/dd/yyyy HH:mm"
                id="dateInput"
                label="Choose date"
                fullWidth
                value={targetDate}
                onChange={setTargetDate}
                showTodayButton
              />
            </Grid>
            {props.getTotalAvailable(targetDate)}
          </MuiPickersUtilsProvider>
        </div>
      </ExpansionPanelDetails>
    </ExpansionPanel>
  );
};
