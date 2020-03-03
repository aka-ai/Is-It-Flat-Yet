import React, { Component } from 'react';
import { GoogleApiWrapper, InfoWindow, Marker } from 'google-maps-react';
import Map from '../Map'
import fakeData from '../fakeData'
import mildIcon from '../mapIcons/yellow.png'
import mediumIcon from '../mapIcons/orange.png'
import severeIcon from '../mapIcons/red.png'
export class MapContainer extends Component {
  constructor(props) {
    super(props)
    this.state = {
      showingInfoWindow: false,  //Hides or the shows the infoWindow
      activeMarker: {},          //Shows the active marker upon click
      selectedPlace: {}          //Shows the infoWindow to the selected place upon a marker
    }
  }

  sendData = () => {
    this.props.sendDataToParent(this.state.selectedPlace);
  }

  onClick = (props, marker, e) => {
    this.setState({
      selectedPlace: props,
      activeMarker: marker,
      showingInfoWindow: true
    })
    this.sendData()
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
    return (
      <Map
        centerAroundCurrentLocation
        google={this.props.google}
      >
        <Marker
          //pulled location from browser's current location
          // location={'you are here'}
          icon={{
            url: ' '
          }}
        />
        {fakeData.map((data, idx) => {
          const thisIcon = this.setIcon(data["Confirmed"])
          return (
          <Marker
            key={idx}
            onClick={this.onClick}
            location={data["Province/State"]}
            country={data["Country/Region"]}
            confirmed={data["Confirmed"]}
            deaths={data["Deaths"]}
            recovered={data["Recovered"]}
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
            <h4>{this.state.selectedPlace.location}</h4>
            {this.state.selectedPlace.confirmed ?
            <p>{this.state.selectedPlace.confirmed - this.state.selectedPlace.deaths - this.state.selectedPlace.recovered} active case(s)</p>
            :<p></p>
          }
          </div>
        </InfoWindow>
      </Map>
    );
  }
}

export default GoogleApiWrapper({
  apiKey: "AIzaSyD_K7emGffTR-zuCTIbDjRIfF4P_LwUEOs"
})(MapContainer)