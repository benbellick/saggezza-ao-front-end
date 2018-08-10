import React, { Component } from 'react';
import './App.css';

import Login from '../../components/Login/Login';
import Register from '../../components/Register/Register';
import Home from '../../containers/Home/Home';

import auth from '../../api/auth';

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      loggedIn: false,
      currentPage: 'login'
    };
  }

  componentDidMount() {
    auth.hasValidToken().then((hasValidToken) => {
      this.setState({
        loggedIn: hasValidToken,
        currentPage: hasValidToken ? 'home' : 'login'
      });
    });
  }

  changeView(page) {
    this.setState({
      currentPage: page,
      loggedIn: page === 'login' ? false : true
    });
  }

  render() {
    const { loggedIn, currentPage } = this.state;

    return (
      <div className="App">
        {(() => {
          if (!loggedIn || currentPage === 'login') {
            return (
              <Login changePage={this.changeView.bind(this)} />
            );
          } else {
            switch (currentPage) {
              case 'register':
                return (
                  <Register changePage={this.changeView.bind(this)} />
                );
                break;
              case 'home':
                return (
                  <Home changePage={this.changeView.bind(this)} />
                );
                break;
              default:
                return (
                  <Login changePage={this.changeView.bind(this)} />
                );
            }
          }
        })()}
      </div>
    )
  }
}

export default App;
