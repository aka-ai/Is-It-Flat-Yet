import React, { Component } from 'react';
import { Map, GoogleApiWrapper, InfoWindow } from 'google-maps-react';
import mapStyle, { USLocation } from '../../helpers/mapUtilities'
import MarkerW from './MarkerW'
import { isBlackList, changeLatLong } from '../../helpers/mapUtilities'
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

  render() {
    let location, country, confirmed,
      deaths, hospitalized, negative, pending, percapitaPercentage, population, totalTestResults

    if (this.state.clickedMarkerKey) {
      location = this.state.clickedMarkerKey.location
      country = this.state.clickedMarkerKey.country
      confirmed = this.state.clickedMarkerKey.confirmed
      deaths = this.state.clickedMarkerKey.deaths
    }
    if (this.state.clickedMarkerKey && country === "US") {
      hospitalized = this.state.clickedMarkerKey.hospitalized
      negative = this.state.clickedMarkerKey.negative
      pending = this.state.clickedMarkerKey.pending
      percapitaPercentage = Number.parseFloat(this.state.clickedMarkerKey.percapitaPercentage).toFixed(3)
      population = this.state.clickedMarkerKey.population
      totalTestResults = this.state.clickedMarkerKey.totalTestResults
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
          {this.renderGlobalMarkers()}
          {this.renderUSMarkers()}
          <InfoWindow
            marker={this.state.activeMarker}
            visible={this.state.showingInfoWindow}
          >
            {country === "US" ? 
              <div>
                <h4>{location} {country}</h4>
                <p>{confirmed} Total Confirmed</p>
                <p>{deaths} {deaths === 1 ? "Death" : "Deaths"}</p>
                {hospitalized !== "n/a" ? <p>{hospitalized} Hospitalized</p> : <p></p>}
                <p>{totalTestResults} Total Test Results</p>
                <p>{population} Total Population</p>
                <p>{percapitaPercentage}% Per Capita</p>
              </div>
            :
            <div>
              {!location ? <h4>{country}</h4>
                :
                <h4>{location} {country}</h4>}
              <p>{confirmed} Total Confirmed</p>
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