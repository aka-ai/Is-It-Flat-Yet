import React, { Component } from 'react';
import { Map, GoogleApiWrapper, InfoWindow, Marker } from 'google-maps-react';
import mildIcon from '../mapIcons/yellow.png'
import mediumIcon from '../mapIcons/orange.png'
import severeIcon from '../mapIcons/red.png'
import mapStyle, { USLocation } from './mapUtilities'
import ClickedMarker from './ClickedMarker'

export class MapContainer extends Component {
  constructor(props) {
    super(props)
    this.state = {
      showingInfoWindow: false,
      selectedPlace: {},
      activeMarker: {},
      data: [],
    }
    this.onMarkerClick = this.onMarkerClick.bind(this)
    this.onMapClick = this.onMapClick.bind(this)
  }

  onMarkerClick = (props, marker, e) => {
    this.setState({
      selectedPlace: props,
      activeMarker: marker,
      showingInfoWindow: true
    })
    this.displayInfoWindow()
    // console.log('FROM MAPCONTAINER', this.state.selectedPlace.position)
    this.props.sendDataToParent(this.state.selectedPlace);
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

  isBlackList = (stateOrProvince, countryOrRegion) => {
    if (countryOrRegion === "guam" ||
      stateOrProvince === "diamond-princess" ||
      stateOrProvince === "grand-princess" ||
      stateOrProvince === "mayotte" ||
      (stateOrProvince === "guadeloupe" && countryOrRegion === "france") ||
      (stateOrProvince === "aruba" && countryOrRegion === "netherlands") ||
      stateOrProvince === "united-states-virgin-islands" ||
      stateOrProvince === "virgin-islands" ||
      countryOrRegion === "greenland" ||
      countryOrRegion === "republic-of-the-congo" ||
      countryOrRegion === "congo-brazzaville" ||
      (countryOrRegion === "netherlands" && stateOrProvince === "")
    ) return true
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

    if (this.isBlackList(stateOrProvince, countryOrRegion)) return
    const active = (
      confirmed - deaths - recovered
    ).toString()
    if (parseInt(active) === 0) return
    const thisIcon = this.setIcon(parseInt(active))
    return (
      <Marker
        key={idx}
        onClick={this.onMarkerClick}
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
  //     return !nextState.showingInfoWindow
  //   }
  displayInfoWindow = () => {
    let { country, location, confirmed, deaths, recovered } = this.state.selectedPlace
    if (country) country = country.toUpperCase()
    if (location) location = location.toUpperCase()
    return (<InfoWindow
      marker={this.state.activeMarker}
      visible={this.state.showingInfoWindow}
    >
      <div>
        {!location ? <h4>{country}</h4>
          :
          <h4>{location} {country}</h4>}
        {confirmed ?
          <p>{confirmed - deaths - recovered} Active Cases</p>
          : <p></p>
        }
        <p>{confirmed} Total Confirmed</p>
        <p>{recovered} Recovered</p>

        <p>{deaths} {deaths === 1 ? "Death" : "Deaths"}</p>
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
          maxZoom={30}
          minZoom={2.5}
          streetViewControl={false}
          mapTypeControl={false}
          backgroundColor={"black"}
          fullscreenControl={false}
          styles={mapStyle}
          gestureHandling={"greedy"}
          onClick={this.onMapClick}
        >
          {
            Object.keys(this.props.data).map((key, idx) => {
              return this.renderMarker(key, idx)
            })
          }
          <ClickedMarker selectedPlace={this.state.selectedPlace} />
        {this.displayInfoWindow()}

        </Map >
      </div>
    );
  }
}

export default GoogleApiWrapper({
  apiKey: "AIzaSyD_K7emGffTR-zuCTIbDjRIfF4P_LwUEOs"
})(MapContainer)