import React, { Component } from 'react';
import { Map, GoogleApiWrapper, Marker } from 'google-maps-react';
import mildIcon from '../mapIcons/yellow.png'
import mediumIcon from '../mapIcons/orange.png'
import severeIcon from '../mapIcons/red.png'
import mapStyle, { USLocation } from './mapUtilities'

export class MapContainer extends Component {
  constructor(props) {
    super(props)
    this.state = {
      clicked: false,
      activeMarker: {},
      selectedPlace: {},
      data: [],
    }
  }

  onClick = (props, marker, e) => {
    this.setState({
      selectedPlace: props,
      activeMarker: marker,
      clicked: true
    })
    this.props.sendDataToParent(this.state.selectedPlace);
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
  shouldComponentUpdate(nextProps, nextState) {
    console.log('nextProps', nextProps.data,'nextState', nextState.selectedPlace)
    return !!!nextState.clicked
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
        </Map >
      </div>
    );
  }
}

export default GoogleApiWrapper({
  apiKey: "AIzaSyD_K7emGffTR-zuCTIbDjRIfF4P_LwUEOs"
})(MapContainer)