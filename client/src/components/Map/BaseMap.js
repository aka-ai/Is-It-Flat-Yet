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
      valid: true
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

  setIcon = deaths => {
    if (deaths >= 1000) {
      return severeIcon
    } else if (deaths < 100) {
      return mildIcon
    } else {
      return mediumIcon
    }
  }

  onMarkerClick = (markerProps, marker, e) => {
    this.setState({
      activeMarker: marker,
      showingInfoWindow: true,
      clickedMarkerKey: markerProps
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

        if (deaths === 0) return;
        return (
          <MarkerW
            key={idx}
            onClick={this.onMarkerClick}
            position={{
              lat: data.lat,
              lng: data.lon
            }}
            label={{
              text: deaths.toString(),
              color: "#002D72",
              fontSize: "3",
              fontFamily: "roboto",
              fontWeight: "bold"
            }}
            icon={{
              url: this.setIcon(deaths)
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

        if (deaths === 0) return
        return (
          <MarkerW
            key={idx}
            onClick={this.onMarkerClick}
            position={{
              lat: data.lat,
              lng: data.lng
            }}
            label={{
              text: deaths.toString(),
              color: "#002D72",
              fontSize: "3",
              fontFamily: "roboto",
              fontWeight: "bold"
            }}
            icon={{
              url: this.setIcon(deaths)
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
        );
      })
    }
  }

  limitVerticalPan(mapProps, map) {
    if (map.center.lat() > 74) {
      map.setCenter({
        lat: 74,
        lng: map.center.lng()
      })
    } else if (map.center.lat() < -70) {
      map.setCenter({
        lat: -70,
        lng: map.center.lng()
      })
    } else {
      map.setCenter({
        lat: map.center.lat(),
        lng: map.center.lng()
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
      deaths = numeral(this.state.clickedMarkerKey.deaths).format('0,0')
    }
    if (this.state.clickedMarkerKey && country === "US") {
      hospitalized = numeral(this.state.clickedMarkerKey.hospitalized).format('0,0') // n/a gets converted to zero
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
          maxZoom={7}
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
        >
          {this.renderGlobalMarkers()}
          {this.renderUSMarkers()}
          <InfoWindow
            marker={this.state.activeMarker}
            visible={this.state.showingInfoWindow}
          >
            {country === "US" ? (
              <div className="infoWindow">
                <div className="infoWindowTitle">
                  <h3>
                    {location}
                  </h3>
                  <p>{population}</p>
                </div>
                <div className="infoWindowDetails">
                  <p>
                    {deaths} {deaths === 1 ? "Death" : "Deaths"}
                  </p>
                  <p>{confirmed} Confirmed</p>
                  {hospitalized === 0 ? (
                    <p>{hospitalized} Hospitalized</p>
                  ) : (
                    <p></p>
                  )}
                  <p>{totalTestResults} Tests</p>
                  {/* <p>{percapitaPercentage}% Per Capita</p> */}
                </div>
              </div>
            ) : (
              <div className="infoWindow">
                <div className="infoWindowTitle">
                  {!location ? (
                    <h3>{country}</h3>
                  ) : (
                    <h3>
                      {location} {country}
                    </h3>
                  )}
                </div>
                <div className="infoWindowDetails">
                  <p>{confirmed} Confirmed</p>
                  <p>
                    {deaths} {deaths === 1 ? "Death" : "Deaths"}
                  </p>
                </div>
              </div>
            )}
          </InfoWindow>
        </Map>
      </div>
    );
  }
}

export default GoogleApiWrapper({
  apiKey: "AIzaSyD_K7emGffTR-zuCTIbDjRIfF4P_LwUEOs"
})(BaseMap)