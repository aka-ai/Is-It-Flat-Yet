import React, { Component } from 'react';
import { Map, GoogleApiWrapper, InfoWindow } from 'google-maps-react';
import mapStyle, { USLocation } from '../../helpers/mapUtilities'
import MarkerW from './MarkerW'
import InfoWindowData from './InfoWindowData'
import { isBlackList } from '../../helpers/mapUtilities'

import mildIcon from '../../mapIcons/yellow.png'
import mediumIcon from '../../mapIcons/orange.png'
import severeIcon from '../../mapIcons/red.png'

export class BaseMap extends Component {
  constructor(props) {
    super(props)
    this.state = {
      showingInfoWindow: false,
      activeMarker: null,
    }
  }

  onMapClick = (props) => {
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

  onMarkerClick = (props, marker, e) => {
    console.log('onMarkerClick called: ', marker)
    this.setState({
      activeMarker: marker,
      showingInfoWindow: true
    })
  }

  renderMarkers = () => {
    return Object.keys(this.props.data).map((key, idx) => {
      const data = this.props.data[key]
      const {
        confirmed,
        deaths,
        recovered,
        countryOrRegion,
        stateOrProvince
      } = data

      if (isBlackList(stateOrProvince, countryOrRegion)) return
      const active = (
        confirmed - deaths - recovered
      ).toString()

      if (parseInt(active) === 0) return
      const thisIcon = this.setIcon(parseInt(active))
      return (
        <MarkerW
          key={idx}
          onClick={this.onMarkerClick}
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
    })
  }

  displayInfoWindow = () => {
    console.log('displayInfoWindow called, current state:', this.state)
    if (this.state.activeMarker === null) return
    let { country, location, confirmed, deaths, recovered } = this.state.activeMarker
    if (country) country = country.toUpperCase()
    if (location) location = location.toUpperCase()
    return (
      <InfoWindow
        marker={this.state.activeMarker}
        visible={this.state.showingInfoWindow}
      >
        <InfoWindowData
          marker={this.state.activeMarker}
        />
      </InfoWindow>)
  }

  render() {
    return (
      <div className="Map-container">
        <Map
          google={this.props.google}
          center={USLocation}
          zoom={4}
          maxZoom={30}
          minZoom={2.5}
          streetViewControl={false}
          mapTypeControl={false}
          backgroundColor={"black"}
          fullscreenControl={false}
          styles={mapStyle}
          gestureHandling={"greedy"}
        // onClick={this.onMapClick}
        >
          {this.renderMarkers()}
          {this.displayInfoWindow()}
        </Map>
      </div>
    );
  }
}

export default GoogleApiWrapper({
  apiKey: "AIzaSyD_K7emGffTR-zuCTIbDjRIfF4P_LwUEOs"
})(BaseMap)