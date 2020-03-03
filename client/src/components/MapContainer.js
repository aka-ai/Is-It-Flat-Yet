import React, { Component } from 'react';
import { GoogleApiWrapper, InfoWindow, Marker } from 'google-maps-react';
import CurrentLocation from '../Map'
export class MapContainer extends Component {
  constructor() {
    super()
    this.state = {
      showingInfoWindow: false,  //Hides or the shows the infoWindow
      activeMarker: {},          //Shows the active marker upon click
      selectedPlace: {}          //Shows the infoWindow to the selected place upon a marker
    }
  }

  onMarkerClick = (props, marker, e) => {
    this.setState({
      selectedPlace: props,
      activeMarker: marker,
      showingInfoWindow: true
    })
  }

  onClose = props => {
    if (this.state.showingInfoWindow) {
      this.setState({
        showingInfoWindow: false,
        activeMarker: null
      })
    }
  }

  render() {
    // console.log(this.props.google.maps)
    const image = 'https://developers.google.com/maps/documentation/javascript/examples/full/images/beachflag.png'
    return (
      <CurrentLocation 
        centerAroundCurrentLocation
        google={this.props.google}
      >
        <Marker 
        //pulled location from browser's current location
          onMouseover={this.onMarkerClick} 
          name={'current location'}
        />

        <Marker
          onMouseover={this.onMarkerClick}
          name={`Downtown Seattle`}
          position={{
            lat: 47.6062,
            lng: -122.3321
          }}
          icon={{
            url: image
          }}
        />
        <Marker 
          onMouseover={this.onMarkerClick}
          name={`Cherry Hill Seattle`}
          position={{
            lat: 47.6062,
            lng: -122.3 }}
        />
        <InfoWindow
          marker={this.state.activeMarker}
          visible={this.state.showingInfoWindow}
          onClose={this.onClose}
        >
          <div>
            <h4>{this.state.selectedPlace.name}</h4>
          </div>
        </InfoWindow>
      </CurrentLocation>
    );
  }
}

export default GoogleApiWrapper({
  apiKey: "AIzaSyD_K7emGffTR-zuCTIbDjRIfF4P_LwUEOs"
})(MapContainer)