import React, { Component } from 'react';
import { Map, GoogleApiWrapper, InfoWindow } from 'google-maps-react';
import mapStyle, { USLocation } from '../../helpers/mapUtilities'
import MarkerW from './MarkerW'
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
      clickedMarkerKey: null,
    }
  }

  onMapClick = (props) => {
    if (this.state.showingInfoWindow) {
      this.setState({
        showingInfoWindow: false,
      })
    }
  }

  setIcon = active => {
    if (active >= 10000) {
      return severeIcon
    } else if (active < 1000) {
      return mildIcon
    } else {
      return mediumIcon
    }
  }

  onMarkerClick = (props, marker, e) => {
    this.setState({
      activeMarker: marker,
      showingInfoWindow: true,
      clickedMarkerKey: props
    })
  }

  renderMarkers = () => {
    return Object.keys(this.props.data).map((key, idx) => {
      const data = this.props.data[key]
      const {
        confirmed,
        deaths,
        countryOrRegion,
        stateOrProvince
      } = data
      if (isBlackList(stateOrProvince, countryOrRegion)) return
      const active = (
        confirmed - deaths
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
          location={stateOrProvince}
          country={countryOrRegion}
          confirmed={confirmed}
          deaths={deaths}
        />
      )
    })
  }

  render() {
    let location, country, confirmed,
      deaths

    if (this.state.clickedMarkerKey) {
      location = this.state.clickedMarkerKey.location
      country = this.state.clickedMarkerKey.country
      confirmed = this.state.clickedMarkerKey.confirmed
      deaths = this.state.clickedMarkerKey.deaths
      if (country) country = country.toUpperCase()
      if (location) location = location.toUpperCase()
    }
    return (
      <div className="Map-container">
        <Map
          google={this.props.google}
          initialCenter={USLocation}
          zoom={4}
          maxZoom={6}
          minZoom={2.5}
          streetViewControl={false}
          mapTypeControl={false}
          backgroundColor={"black"}
          fullscreenControl={false}
          styles={mapStyle}
          gestureHandling={"greedy"}
          onClick={this.onMapClick}
        >
          {this.renderMarkers()}
          <InfoWindow
            marker={this.state.activeMarker}
            visible={this.state.showingInfoWindow}
          >
            <div>
              {!location ? <h4>{country}</h4>
                :
                <h4>{location} {country}</h4>}
              <p>{confirmed} Total Confirmed</p>
              <p>{deaths} {deaths === 1 ? "Death" : "Deaths"}</p>
            </div>
          </InfoWindow>
        </Map>
      </div>
    );
  }
}

export default GoogleApiWrapper({
  apiKey: "AIzaSyD_K7emGffTR-zuCTIbDjRIfF4P_LwUEOs"
})(BaseMap)