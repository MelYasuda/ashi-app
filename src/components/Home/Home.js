import React, { Component } from 'react';
import './Home.css';
import background from '../../assets/img/home-background.jpeg';
import SearchBar from '../SearchBar/SearchBar';

class Home extends Component {
  render() {
    return (
      <div style={homeStyle}>
        <div>Where is you school?</div>
        <SearchBar history={this.props.history}/>
      </div>
    );
  }
}

const homeStyle = {
  backgroundImage: 'url(' + background + ')',
  backgroundPosition: 15 +'%',
  height: 93 +'vh',
  width: 100 + '%',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  color: 'white',
  fontSize: 40
};

export default Home;
