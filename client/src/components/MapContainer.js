import React, { Component } from 'react';
import { GoogleApiWrapper, InfoWindow, Marker } from 'google-maps-react';
import Map from '../Map'
import fakeData from '../fakeData'
export class MapContainer extends Component {
  constructor() {
    super()
    this.state = {
      showingInfoWindow: false,  //Hides or the shows the infoWindow
      activeMarker: {},          //Shows the active marker upon click
      selectedPlace: {}          //Shows the infoWindow to the selected place upon a marker
    }
  }

  onClick = (props, marker, e) => {
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
    const image = 'https://developers.google.com/maps/documentation/javascript/examples/full/images/beachflag.png'
    return (
      <Map
        centerAroundCurrentLocation
        google={this.props.google}
      >
        <Marker
          //pulled location from browser's current location
          onClick={this.onClick}
          name={'you are here'}
          icon={{
            url: image
          }}
        />
        {fakeData.map((data, idx) => (
          <Marker
            key={idx}
            onClick={this.onClick}
            name={data["Province/State"]}
            position={{
              lat: data.Lat,
              lng: data.Long
            }}
            icon={{
              url: image
            }}
          />
        ))}
        <InfoWindow
          marker={this.state.activeMarker}
          visible={this.state.showingInfoWindow}
          onClose={this.onClose}
        >
          <div>
            <h4>{this.state.selectedPlace.name}</h4>
          </div>
        </InfoWindow>
      </Map>
    );
  }
}

export default GoogleApiWrapper({
  apiKey: "AIzaSyD_K7emGffTR-zuCTIbDjRIfF4P_LwUEOs"
})(MapContainer)