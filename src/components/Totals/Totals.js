import 'date-fns';
import React from 'react';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

export default (props) => {
  return (
    <ExpansionPanel>
      <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
        <Typography>Totals</Typography>
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
          {props.getTotalAvailable()}
          {props.getTotalSpent()}
          {props.getMonthlyDataset()}
        </div>
      </ExpansionPanelDetails>
    </ExpansionPanel>
  );
};
