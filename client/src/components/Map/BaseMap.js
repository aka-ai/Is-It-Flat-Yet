import React, { Component } from 'react';
import { Map, GoogleApiWrapper, InfoWindow } from 'google-maps-react';
import { mapStyle, USLocation } from "./BaseMapConstants";
import MarkerW from './MarkerW'
import { isBlackList, changeLatLong } from './BaseMapHelper'
import { mildIcon, mediumIcon, severeIcon } from './MapIcons'
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

  renderMarkers = (data) => {
    if (data) {
      return data.map((entity, idx) => {
        if (isBlackList(entity)) return
        const {
          lat,
          lng,
          confirmed,
          deaths,
          countryOrRegion,
          cityStateOrProvince,
          hospitalized,
          negative,
          pending,
          percapitaPercentage,
          population,
          totalTestResults
        } = entity

        if (!deaths) {
          // We are focusing on deaths, don't render markers without deaths for now
          return;
        } else {
          return (
            <MarkerW
              key={idx}
              onClick={this.onMarkerClick}
              position={{
                lat: lat,
                lng: lng
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
              location={cityStateOrProvince}
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
        }
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
    const data = this.props.data

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
          {data.usData && this.renderMarkers(this.props.data.usData.states)}
          {data.globalData && this.renderMarkers(this.props.data.globalData.countries)}
          <InfoWindow
            marker={this.state.activeMarker}
            visible={this.state.showingInfoWindow}
          >
            {country === "US" ? (
              <div className="infoWindow">
                <div className="infoWindowTitle">
                  <h3>{location}</h3>
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