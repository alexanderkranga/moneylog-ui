import React from 'react';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(theme => ({
  '@global': {
    body: {
      backgroundColor: theme.palette.common.white
    }
  },
  paper: {
    marginTop: theme.spacing(20),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center'
  },
  form: {
    marginTop: theme.spacing(1)
  },
  submit: {
    margin: theme.spacing(1, 0, 1)
  }
}));

export default props => {
  const classes = useStyles();

  return (
    <React.Fragment>
      <CssBaseline />
      <div className={classes.paper}>
        <Typography component="h1" variant="h5">
          MoneyLog
        </Typography>
        <TextField
          variant="outlined"
          margin="dense"
          required
          fullWidth
          id="username"
          label="Username"
          name="username"
          defaultValue={props.username}
          onChange={props.onUsernameChange}
          error={props.errorMessage !== null}
          helperText={props.errorMessage}
        />
        <Button
          fullWidth
          variant="contained"
          color="primary"
          className={classes.submit}
          onClick={props.login}
        >
          Login
        </Button>
        <Button
          fullWidth
          variant="outlined"
          color="primary"
          className={classes.submit}
          onClick={props.register}
        >
          Register
        </Button>
      </div>
    </React.Fragment>
  );
};
