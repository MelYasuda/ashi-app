import React, { Component } from 'react';
import './App.css';
import NavBar from './NavBar/NavBar';
import { library } from '@fortawesome/fontawesome-svg-core'
import { faUser, faHome, faHeart} from '@fortawesome/free-solid-svg-icons'
import Home from './Home/Home';

library.add(faUser, faHome, faHeart);

class App extends Component {
  render() {
    return (
      <div className="App">
        <NavBar />
        <header className="App-header">
          <Home />
        </header>
      </div>
    );
  }
}

export default App;
