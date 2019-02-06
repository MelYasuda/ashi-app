import React, { Component } from 'react';
import Script from 'react-load-script';
import googleMapApi from '../../constants/GoogleMapApi'


class AutoCompleteForm extends Component {
  constructor(props){
    super(props);
    this.state = {
      city: '',
      query: ''
    }
    console.log("auto")
    this.handleScriptLoad = this.handleScriptLoad.bind(this);
    this.handlePlaceSelect = this.handlePlaceSelect.bind(this);
  }

  handleScriptLoad() {
    // Declare Options For Autocomplete
    var options = {
      types: ['(cities)'],
    };
    // Initialize Google Autocomplete
    /*global google*/ // To disable any eslint 'google not defined' errors
    this.autocomplete = new google.maps.places.Autocomplete(
      document.getElementById('autocomplete'),
      options,
    );
    // Fire Event when a suggested name is selected
    this.autocomplete.addListener('place_changed', this.handlePlaceSelect);
  }

  handlePlaceSelect() {

    // Extract City From Address Object
    let addressObject = this.autocomplete.getPlace();
    let address = addressObject.address_components;

    // Check if address is valid
    if (address) {
      // Set State
      this.setState(
        {
          city: address[0].long_name,
          query: addressObject.formatted_address,
        }
      );
    }
  }

  render(){
    console.log(googleMapApi);
    const urlsrc = 'https://maps.googleapis.com/maps/api/js?key=' + googleMapApi + '&libraries=places'
    return(
      <div>
      <Script url={urlsrc} onLoad={this.handleScriptLoad} /> 
        <input id="autocomplete" placeholder="Search City" value={this.state.query} onChange={event => this.setState({query: event.target.value})}/>
      </div>
    );
  }
}

export default AutoCompleteForm;