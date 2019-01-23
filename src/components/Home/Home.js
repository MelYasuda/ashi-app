import React, { Component } from 'react';
import './Home.css';
import background from '../../assets/img/home-background.jpg';

class Home extends Component {
  render() {
    return (
      <div style={homeStyle}>
        <div>Where is you school?</div>
      </div>
    );
  }
}

const homeStyle = {
  backgroundImage: 'url(' + background + ')',
  height: 92 +'vh',
  width: 100 + '%',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  color: 'white',
  fontSize: 40
};

export default Home;
