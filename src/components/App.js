import React, { Component } from 'react';
import './App.css';
import NavBar from './NavBar/NavBar';

class App extends Component {
  render() {
    return (
      <div className="App">
        <NavBar />
        <header className="App-header">
          <h1>Ashi</h1>
        </header>
      </div>
    );
  }
}

export default App;
