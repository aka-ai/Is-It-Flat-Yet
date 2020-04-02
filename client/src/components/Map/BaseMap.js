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
        changeLatLong(data)
        const {
          displayName,
          lat,
          lng,
          latestConfirmed,
          latestDeaths,
          countryOrRegion,
          hospitalized,
          population,
          totalTestResults
        } = entity

        if (!latestDeaths) {
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
                text: latestDeaths.toString(),
                color: "#002D72",
                fontSize: "3",
                fontFamily: "roboto",
                fontWeight: "bold"
              }}
              icon={{
                url: this.setIcon(latestDeaths)
              }}
              displayName={displayName}
              country={countryOrRegion}
              latestConfirmed={latestConfirmed}
              latestDeaths={latestDeaths}
              hospitalized={hospitalized}
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
    let displayName, country, latestConfirmed, latestDeaths, hospitalized, population, totalTestResults

    if (this.state.clickedMarkerKey) {
      displayName = this.state.clickedMarkerKey.displayName
      country = this.state.clickedMarkerKey.country
      latestConfirmed = numeral(this.state.clickedMarkerKey.latestConfirmed).format('0,0')
      latestDeaths = numeral(this.state.clickedMarkerKey.latestDeaths).format("0,0");
    }
    if (this.state.clickedMarkerKey && country === "US") {
      hospitalized = numeral(this.state.clickedMarkerKey.hospitalized).format('0,0') // n/a gets converted to zero
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
          {data.usData && this.renderMarkers(data.usData.states)}
          {data.globalData &&
            this.renderMarkers(data.globalData.countries)}
          <InfoWindow
            marker={this.state.activeMarker}
            visible={this.state.showingInfoWindow}
          >
            {country === "US" ? (
              <div className="infoWindow">
                <div className="infoWindowTitle">
                  <h3>{displayName}</h3>
                  <p>{population}</p>
                </div>
                <div className="infoWindowDetails">
                  <p>
                    {latestDeaths}{" "}
                    {latestDeaths === 1 ? "Death" : "Deaths"}
                  </p>
                  <p>{latestConfirmed} Confirmed</p>
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
                  <h3>{displayName}</h3>
                </div>
                <div className="infoWindowDetails">
                  <p>
                    {latestDeaths}{" "}
                    {latestDeaths === 1 ? "Death" : "Deaths"}
                  </p>
                  <p>{latestConfirmed} Confirmed</p>
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