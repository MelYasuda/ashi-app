import React, { Component } from 'react';
import './SearchBar.css';
import { connect } from 'react-redux';

class SearchBar extends Component {

  _handleSearch = () => {
    alert("handleSearch");
    const { dispatch } = this.props;
    const action = {
      type: 'SEARCH',
      country: 'United States',
      city: 'New York'
    }
    dispatch(action);
  }

  render() {
    return (
      <div className="SearchBar">
        <form className="search-form" onSubmit={this._handleSearch}>
          <input type="text" className="form-control" placeholder="Enter an address,or city" />
          <button type="submit" className="btn btn-primary">Search</button>
        </form>
      </div>
    );
  }
}

export default connect()(SearchBar);