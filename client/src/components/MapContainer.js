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
      selectedPlace: {},
      clicked: false,
      activeMarker: {},
      data: [],
    }
  }

  onClick = (props, marker, e) => {
    this.setState({
      selectedPlace: props,
      activeMarker: marker,
      clicked: true,
      showingInfoWindow: true
    })
    this.displayInfoWindow()
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
        onMouseout={this.onMouseout}
        onMouseover={this.onMouseover}
        location={stateOrProvince}
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
  // shouldComponentUpdate(nextProps, nextState) {
  //   return !!!nextState.clicked
  // }
  onClose = () => {
    if (this.state.showingInfoWindow) {
      return mediumIcon
    }
  }
  capFirstLetter = (word) => {
    return word.charAt(0).toUppercase() + word.slice(1)
  }
  displayInfoWindow = () => {
    const { country, location, confirmed, deaths, recovered } = this.state.selectedPlace
    return (<InfoWindow
      marker={this.state.activeMarker}
      visible={this.state.showingInfoWindow}
      onClose={this.onClose}
    >
      <div>
        {!location ? <h4>{country}</h4>
        :
        <h4>{location} {country}</h4>}
        {confirmed ?
          <p>{confirmed - deaths - recovered} active cases</p>
          : <p></p>
        }
        <p>{confirmed} total confirmed</p>
        <p>{recovered} recovered</p>

        <p>{deaths} {deaths === 1 ? "death" : "deaths"}</p>
      </div>
    </InfoWindow>)
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