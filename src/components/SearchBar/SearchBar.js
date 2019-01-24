import React, { Component } from 'react';
import './SearchBar.css';

class SearchBar extends Component {
  render() {
    return (
      <div className="SearchBar">
        <form>
          <input type="text" className="form-control" placeholder="Enter an address,or city" />
          <button type="submit" className="btn btn-primary">Search</button>
        </form>
      </div>
    );
  }
}

export default SearchBar;