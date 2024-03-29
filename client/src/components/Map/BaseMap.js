import React, { Component } from 'react';
import { Map, GoogleApiWrapper } from 'google-maps-react';
import { mapStyle, USLocation } from "./BaseMapConstants";
import MarkerW from './MarkerW'
import { isBlackList, sanitize } from "./BaseMapHelper";
import { mildIcon, mediumIcon, severeIcon } from './MapIcons'
import InfoWindowW from './InfoWindowW'
import numeral from 'numeral';
import Graph from '../Graph'

export class BaseMap extends Component {
  constructor(props) {
    super(props)
    this.state = {
      showingInfoWindow: false,
      activeMarker: null,
      clickedMarkerKey: null,
      lastValidPan: { lat: USLocation.lat, lng: USLocation.lng },
      valid: true,
      entityData: null,
      graphType: "Cumulative"
    }
    this.limitVerticalPan = this.limitVerticalPan.bind(this)
    this.onMarkerClick = this.onMarkerClick.bind(this)
    this.onGraphClick = this.onGraphClick.bind(this)
  }

  onGraphClick() {
    const type = this.state.graphType === 'Cumulative' ? 'Non-Cumulative' : 'Cumulative'
    this.setState({ graphType: type })
  }

  onMapClick = (props) => {
    if (this.state.showingInfoWindow) {
      this.setState({
        showingInfoWindow: false,
        graphType: "Cumulative"
      })
    }
  }

  setIcon = deaths => {
    if (deaths >= 10000) {
      return severeIcon
    } else if (deaths < 1000) {
      return mildIcon
    } else {
      return mediumIcon
    }
  }

  async onMarkerClick(markerProps, marker, e) {

    const data = await markerProps.firebase.getHistoryData(markerProps.entityId)

    this.setState({
      activeMarker: marker,
      showingInfoWindow: true,
      clickedMarkerKey: markerProps,
      entityData: data,
      graphType: "Non-Cumulative"
    })
  }

  renderMarkers(data) {
    if (data) {
      return data.map((entity, idx) => {
        if (isBlackList(entity)) return
        const {
          displayName,
          latestConfirmed,
          latestDeaths,
          countryOrRegion,
          hospitalized,
          population,
          totalTestResults,
          entityId,
          stateAbbreviation,
        } = entity
        // const { lat, lng } = changeLatLong(entity)
        entity = sanitize(entity)

        if (!latestDeaths) {
          // We are focusing on deaths, don't render markers without deaths for now
          return;
        } else {
          return (
            <MarkerW
              key={idx}
              onClick={this.onMarkerClick}
              position={{
                lat: entity.lat,
                lng: entity.lng
              }}
              label={{
                text: latestDeaths.toString(),
                color: "#002D72",
                fontSize: "3",
                fontFamily: "roboto",
                fontWeight: "bold",
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
              entityId={entityId}
              stateAbbreviation={stateAbbreviation}
              firebase={this.props.firebase}
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

    let displayName, country, latestConfirmed, latestDeaths, hospitalized, population, totalTestResults, entityId

    if (this.state.clickedMarkerKey) {
      displayName = this.state.clickedMarkerKey.displayName
      country = this.state.clickedMarkerKey.country
      latestConfirmed = numeral(this.state.clickedMarkerKey.latestConfirmed).format('0,0')
      latestDeaths = numeral(this.state.clickedMarkerKey.latestDeaths).format("0,0");
      entityId = this.state.clickedMarkerKey.entityId
    }
    if (this.state.clickedMarkerKey && country === "US") {
      hospitalized = numeral(this.state.clickedMarkerKey.hospitalized).format('0,0') // n/a gets converted to zero
      population = numeral(this.state.clickedMarkerKey.population).format('0.0a')
      totalTestResults = numeral(this.state.clickedMarkerKey.totalTestResults).format('0,0')
    }
    const data = this.props.data
    return (
      <React.Fragment>
        <div className="dataContainer">
          <div className="map">
            <Map
              google={this.props.google}
              initialCenter={USLocation}
              zoom={4}
              maxZoom={8}
              minZoom={2.5}
              streetViewControl={false}
              mapTypeControl={false}
              zoomControl={false}
              backgroundColor={"black"}
              fullscreenControl={false}
              containerStyle={{
                position: 'relative',
                width: '100vw',
                height: '80vh'
              }}
              styles={mapStyle}
              gestureHandling={"greedy"}
              onClick={this.onMapClick}
              onDragend={this.limitVerticalPan}
              entityId={entityId}
            >
              {data.usData && this.renderMarkers(data.usData.states)}
              {data.globalData &&
                this.renderMarkers(data.globalData.countries)}
              < InfoWindowW
                marker={this.state.activeMarker}
                visible={this.state.showingInfoWindow}
              >
                <div className="infoWindow">
                  <div className="infoWindowTitle">
                    <h3>{displayName}</h3>
                    {population ? (<p>Population {population}</p>) : <p></p>}
                  </div>
                  <Graph
                    entityData={this.state.entityData}
                    usCountryData={this.props.usCountryData}
                    latestConfirmed={latestConfirmed}
                    isLoading={this.props.isLoading}
                    graphType={this.state.graphType}
                  />
                  <button onClick={this.onGraphClick} className="graphButton">Show {this.state.graphType === 'Cumulative' ? "Non-Cumulative" : "Cumulative"} Graph </button>
                  <div className="infoWindowDetails">
                    <p>
                      {latestDeaths}{" "}
                      {latestDeaths === 1 ? "Death" : "Deaths"}
                    </p>
                    <p>{latestConfirmed} Confirmed</p>
                    {hospitalized && hospitalized !== "0" ? (
                      <p>{hospitalized} Hospitalized</p>
                    ) : <p></p>}
                    {totalTestResults ? (<p>{totalTestResults} Tests</p>) : <p></p>}
                  </div>
                </div>
              </ InfoWindowW>
            </Map>
          </div>

        </div>
      </React.Fragment>
    );
  }
}

export default GoogleApiWrapper({
  apiKey: "AIzaSyD_K7emGffTR-zuCTIbDjRIfF4P_LwUEOs"
})(BaseMap)