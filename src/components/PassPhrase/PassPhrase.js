import 'date-fns';
import React from 'react';
import TextField from '@material-ui/core/TextField';
import Paper from '@material-ui/core/Paper';

export default (props) => {
  return (
    <Paper style={{ padding: '10px', marginBottom: '5px' }}>
      <TextField
        id="passPhraseInput"
        type="password"
        name="passPhrase"
        label="Pass phrase"
        fullWidth
        value={props.passPhrase}
        onChange={props.handlePassPhraseChange}
      />
    </Paper>
  );
};
