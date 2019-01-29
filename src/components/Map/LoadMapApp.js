import React, { Component } from 'react';
import { GoogleApiWrapper, InfoWindow, Marker } from 'google-maps-react';
import googleMapApi from '../../constants/GoogleMapApi'

import CurrentLocation from './Map';

export class MapContainer extends Component {
  state = {
    showingInfoWindow: false,
    activeMarker: {},
    selectedPlace: {}
  };

  onMarkerClick = (props, marker, e) =>
    this.setState({
      selectedPlace: props,
      activeMarker: marker,
      showingInfoWindow: true
    });

  onClose = props => {
    if (this.state.showingInfoWindow) {
      this.setState({
        showingInfoWindow: false,
        activeMarker: null
      });
    }
  };

  render() {
    return (
      <div style={mapStyle}>

      <CurrentLocation centerAroundCurrentLocation google={this.props.google}>
        <Marker onClick={this.onMarkerClick} name={'your location'} />
        <InfoWindow
          marker={this.state.activeMarker}
          visible={this.state.showingInfoWindow}
          onClose={this.onClose}
        >
          <div>
            <h5>{this.state.selectedPlace.name}</h5>
          </div>
        </InfoWindow>
      </CurrentLocation>
      </div>
    );
  }
}

const mapStyle = {
 


  alignItems: 'right',
  color: 'black',
  fontSize: 30
};




export default GoogleApiWrapper({
  apiKey: googleMapApi
})(MapContainer);