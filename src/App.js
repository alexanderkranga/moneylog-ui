import React, { Component } from 'react';
import MainApp from './components/MainApp';
import SignIn from './components/SignIn';
import Container from '@material-ui/core/Container';
import CssBaseline from '@material-ui/core/CssBaseline';
import restclient from './restclient';

class App extends Component {
  constructor(props) {
    super(props);
    const localStorageUserName = localStorage.getItem('username');
    const sessionStorageUserName = sessionStorage.getItem('username');
    this.state = {
      username: localStorageUserName,
      authenticated:
        sessionStorageUserName !== null && sessionStorageUserName.trim() !== '',
      errorMessage: null,
    };
  }

  login = async () => {
    try {
      this.setState({
        errorMessage: null,
      });
      await restclient.webauthn.login(this.state.username);
      this.setState({
        authenticated: true,
      });
    } catch (error) {
      this.setState({
        errorMessage: error.message,
      });
    }
  };

  register = async () => {
    try {
      this.setState({
        errorMessage: null,
      });
      await restclient.webauthn.register(this.state.username);
      this.setState({
        authenticated: true,
      });
    } catch (error) {
      this.setState({
        errorMessage: error.message,
      });
    }
  };

  onUsernameChange = (event) => {
    this.setState({ username: event.target.value, errorMessage: null });
  };

  render = () => {
    return (
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        {this.state.authenticated ? (
          <MainApp username={this.state.username} />
        ) : (
          <SignIn
            login={this.login}
            register={this.register}
            onUsernameChange={this.onUsernameChange}
            username={this.state.username}
            errorMessage={this.state.errorMessage}
          />
        )}
      </Container>
    );
  };
}

export default App;
