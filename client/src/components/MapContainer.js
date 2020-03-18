import React, { Component } from 'react';
import { Map, GoogleApiWrapper, InfoWindow, Marker } from 'google-maps-react';
import mildIcon from '../mapIcons/yellow.png'
import mediumIcon from '../mapIcons/orange.png'
import severeIcon from '../mapIcons/red.png'
import mapStyle, { USLocation } from './mapUtilities'

export class MapContainer extends Component {
  constructor(props) {
    super(props)
    this.state = {
      showingInfoWindow: false,
      activeMarker: {},
      selectedPlace: {},
      data: []
    }
  }

  onClick = (props, marker, e) => {
    this.setState({
      selectedPlace: props,
      activeMarker: marker,
      showingInfoWindow: true
    })
    this.props.sendDataToParent(this.state.selectedPlace);
  }

  // onMouseover = (props, marker, e) => {
  //   if (!this.state.showingInfoWindow) {
  //     this.setState({
  //       selectedPlace: props,
  //       activeMarker: marker,
  //       showingInfoWindow: true
  //     })
  //   }
  // }

  // onMouseout = (props, marker, e) => {
  //   if (this.state.showingInfoWindow) {
  //     this.setState({
  //       selectedPlace: {},
  //       activeMarker: null,
  //       showingInfoWindow: false
  //     })
  //   }
  // }

  onClose = () => {
    if (this.state.showingInfoWindow) {
      this.setState({
        showingInfoWindow: false,
        activeMarker: null
      })
    }
  }

  setIcon = active => {
    if (active > 1000) {
      return severeIcon
    } else if (active < 100) {
      return mildIcon
    } else {
      return mediumIcon
    }
  }
  displayInfoWindow = () => {
    const { location, confirmed, deaths, recovered } = this.state.selectedPlace
    return (<InfoWindow
      marker={this.state.activeMarker}
      visible={this.state.showingInfoWindow}
      onClose={this.onClose}
    >
      <div>
        <h4>{location}</h4>
        {confirmed ?
          <p>{confirmed - deaths - recovered} active case(s)</p>
          : <p></p>
        }
      </div>
    </InfoWindow>)
  }

  renderMarker(key, idx) {
    const data = this.props.data[key]
    const {
      confirmed,
      deaths,
      recovered,
      countryOrRegion,
      stateOrProvince
    } = data
    const active = (
      confirmed - deaths - recovered
    ).toString()
    if (parseInt(active) === 0) return
    const thisIcon = this.setIcon(parseInt(active))
    return (
      <Marker
        key={idx}
        onClick={this.onClick}
        location={stateOrProvince + '\n' + countryOrRegion}
        country={countryOrRegion}
        confirmed={confirmed}
        deaths={deaths}
        recovered={recovered}
        position={{
          lat: data.lat,
          lng: data.lon
        }}
        label={{
          text: active,
          color: "#0f07f7",
          fontSize: "3",
          fontFamily: "roboto",
          fontWeight: "bold"
        }}
        icon={{
          url: thisIcon
        }}
      />
    )
  }

  render() {
    return (
      <div className="Map-container">
        <Map
          google={this.props.google}
          center={USLocation}
          zoom={4}
          maxZoom={9}
          minZoom={2.5}
          streetViewControl={false}
          mapTypeControl={false}
          backgroundColor={"black"}
          fullscreenControl={false}
          styles={mapStyle}
          gestureHandling={"greedy"}
        >
          {
            Object.keys(this.props.data).map((key, idx) => {
              return this.renderMarker(key, idx)
            })
          }
          {this.displayInfoWindow()}
        </Map >
      </div>
    );
  }
}

export default GoogleApiWrapper({
  apiKey: "AIzaSyD_K7emGffTR-zuCTIbDjRIfF4P_LwUEOs"
})(MapContainer)