import React, { Component } from 'react';
import { GoogleApiWrapper, InfoWindow, Marker } from 'google-maps-react';
import Map from '../Map'
import fakeData from '../fakeData'
import mildIcon from '../mapIcons/1.png'
import mediumIcon from '../mapIcons/2.png'
import severeIcon from '../mapIcons/3.png'
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

  setIcon = confirmed => {
    if (confirmed > 10) {
      return severeIcon
    } else if (confirmed < 3) {
      return mildIcon
    } else {
      return mediumIcon
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
        />
        {fakeData.map((data, idx) => {
          const thisIcon = this.setIcon(data["Confirmed"])
          return (
          <Marker
            key={idx}
            onClick={this.onClick}
            name={data["Province/State"]}
            position={{
              lat: data.Lat,
              lng: data.Long
            }}
            icon={{
              url: thisIcon
            }}
          />
        )})}
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