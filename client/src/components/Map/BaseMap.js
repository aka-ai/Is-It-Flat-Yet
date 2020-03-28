import React, { Component } from 'react';
import { Map, GoogleApiWrapper, InfoWindow } from 'google-maps-react';
import mapStyle, { USLocation } from '../../helpers/mapUtilities'
import MarkerW from './MarkerW'
import { isBlackList, changeLatLong } from '../../helpers/mapUtilities'
import mildIcon from '../../mapIcons/yellow.png'
import mediumIcon from '../../mapIcons/orange.png'
import severeIcon from '../../mapIcons/red.png'
import numeral from 'numeral';


export class BaseMap extends Component {
  constructor(props) {
    super(props)
    this.state = {
      showingInfoWindow: false,
      activeMarker: null,
      clickedMarkerKey: null,
      lastValidPan: { lat: USLocation.lat, lng: USLocation.lng },
      centerAround: { lat: USLocation.lat, lng: USLocation.lng }
    }
    this.limitVerticalPan = this.limitVerticalPan.bind(this)
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

  renderGlobalMarkers = () => {
    if (this.props.data.globalData) {
      return Object.keys(this.props.data.globalData).map((key, idx) => {
        if (isBlackList(key)) return
        const data = this.props.data.globalData[key]
        changeLatLong(data)
        const {
          confirmed,
          deaths,
          countryOrRegion,
          stateOrProvince
        } = data

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
              color: "#002D72",
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
  }
  renderUSMarkers = () => {
    if (this.props.data.usData) {
      return this.props.data.usData.states.map((data, idx) => {
        const {
          confirmed,
          deaths,
          countryOrRegion,
          stateOrProvince,
          hospitalized,
          negative,
          pending,
          percapitaPercentage,
          population,
          totalTestResults
        } = data

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
              lng: data.lng
            }}
            label={{
              text: active,
              color: "#002D72",
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
            hospitalized={hospitalized}
            negative={negative}
            pending={pending}
            percapitaPercentage={percapitaPercentage}
            population={population}
            totalTestResults={totalTestResults}
          />
        )
      })
    }
  }

  limitVerticalPan(mapProps, map) {
    if (map.center.lat() > 76) {
      this.setState({
        lastValidPan: {
          lat: 76,
          lng: this.state.lastValidPan.lng
        }
      })
    } else if (map.center.lat() < -70) {
      this.setState({
        lastValidPan: {
          lat: -70,
          lng: this.state.lastValidPan.lng
        }
      })
    } else if (!this.state.lastValidPan) {
      this.setState({
        lastValidPan: {
          lat: map.center.lat(),
          lng: map.center.lng()
        }
      })
    } else {
      this.setState({
        lastValidPan: {
          lat: map.center.lat(),
          lng: map.center.lng()
        }
      })
    }
  }

  render() {
    let location, country, confirmed,
      deaths, hospitalized, negative, pending, percapitaPercentage, population, totalTestResults

    if (this.state.clickedMarkerKey) {
      location = this.state.clickedMarkerKey.location
      country = this.state.clickedMarkerKey.country
      confirmed = numeral(this.state.clickedMarkerKey.confirmed).format('0,0')
      deaths = this.state.clickedMarkerKey.deaths
    }
    if (this.state.clickedMarkerKey && country === "US") {
      hospitalized = numeral(this.state.clickedMarkerKey.hospitalized).format('0,0')
      negative = this.state.clickedMarkerKey.negative
      pending = this.state.clickedMarkerKey.pending
      percapitaPercentage = Number.parseFloat(this.state.clickedMarkerKey.percapitaPercentage).toFixed(3)
      population = numeral(this.state.clickedMarkerKey.population).format('0.0a')
      totalTestResults = numeral(this.state.clickedMarkerKey.totalTestResults).format('0,0')
    }

    return (
      <div className="Map-container">
        <Map
          google={this.props.google}
          initialCenter={USLocation}
          zoom={4}
          maxZoom={5}
          minZoom={2.5}
          streetViewControl={false}
          mapTypeControl={false}
          zoomControl={false}
          backgroundColor={"black"}
          fullscreenControl={false}
          styles={mapStyle}
          gestureHandling={"greedy"}
          onClick={this.onMapClick}
          onDragend={this.limitVerticalPan}
          center={{
            lat: this.state.lastValidPan.lat,
            lng: this.state.lastValidPan.lng
          }}
        >
          {this.renderGlobalMarkers()}
          {this.renderUSMarkers()}
          <InfoWindow
            marker={this.state.activeMarker}
            visible={this.state.showingInfoWindow}
          >
            {country === "US" ?
              <div className="infoWindow">
                <h3 className="infoWindowTitle">{location} {country}</h3>
                <p>Confirmed: {confirmed}</p>
                <p>{deaths === 1 ? "Death" : "Deaths"}: {deaths}</p>
                {hospitalized !== "n/a" ? <p>Hospitalized: {hospitalized}</p> : <p></p>}
                <p>Test Results: {totalTestResults}</p>
                <p>Population: {population}</p>
                {/* <p>{percapitaPercentage}% Per Capita</p> */}
              </div>
              :
              <div className="infoWindow">
                {!location ? <h3 className="infoWindowTitle">{country}</h3>
                  :
                  <h3 className="infoWindowTitle">{location} {country}</h3>}
                <p>{confirmed} Confirmed</p>
                <p>{deaths} {deaths === 1 ? "Death" : "Deaths"}</p>
              </div>
            }
          </InfoWindow>
        </Map>
      </div>
    );
  }
}

export default GoogleApiWrapper({
  apiKey: "AIzaSyD_K7emGffTR-zuCTIbDjRIfF4P_LwUEOs"
})(BaseMap)