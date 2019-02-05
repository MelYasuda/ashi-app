import React, { Component } from 'react';
import './SearchBar.css';
import { connect } from 'react-redux';
import { Formik } from 'formik';

class SearchBar extends Component {

  _handleSearch = (values) => {
    const { searchValue } = values;
    const searchValues = searchValue.split(',');
    console.log(searchValues);
    const { dispatch } = this.props;
    const action = {
      type: 'SEARCH',
      country: searchValues[1],
      city: searchValues[0]
    }
    dispatch(action);
    this.props.history.push("/listings")
  }

  render() {
    return (
      <div className="SearchBar">
        <Formik
          initialValues={{ searchValue: '' }}
          onSubmit={this._handleSearch}
          render={({
            values,
            handleSubmit,
            handleChange
          }) => (
            <form className="search-form" onSubmit={handleSubmit}>
              <input
               value={values.searchValue}
               onChange={handleChange}
               name='searchValue'
               type="text" className="form-control" placeholder="Enter the city where your school is" />
              <button type="submit" className="btn btn-primary">Search</button>
            </form>
          )}
          />
      </div>
    );
  }
}

export default connect()(SearchBar);