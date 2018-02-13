import React, { Component } from 'react';
import './App.css';

//JWT
import Signin from './component/Signin';
import Welcome from './component/Welcome';
import { BrowserRouter as Router, Route } from 'react-router-dom';

class App extends Component {
  static propTypes = {

  };

  constructor(props) {
    super(props);
    this.state = {

    };
  }

  render() {


    return (
      <div className="App">
        <Router>
          <div>
            <Route exact path='/' component={Signin} />
            <Route exact path='/welcome' component={Welcome} />
          </div>
        </Router>
      </div>
    );
  }
}

export default App; 
