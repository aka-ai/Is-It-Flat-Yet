import React, { Component } from 'react';
import { Map, GoogleApiWrapper, InfoWindow, Marker } from 'google-maps-react';
import mildIcon from '../mapIcons/yellow.png'
import mediumIcon from '../mapIcons/orange.png'
import severeIcon from '../mapIcons/red.png'
export class MapContainer extends Component {
  constructor(props) {
    super(props)
    this.state = {
      // Hides or the shows the infoWindow
      showingInfoWindow: false,
      // Shows the active marker upon click
      activeMarker: {},
      // Shows the infoWindow to the selected place upon a marker
      selectedPlace: {},
      data: []
    }
  }

  /*
  onClick = (props, marker, e) => {
    this.props.sendDataToParent(this.state.selectedPlace);
  }

  onMouseover = (props, marker, e) => {
    if (!this.state.showingInfoWindow) {
      this.setState({
        selectedPlace: props,
        activeMarker: marker,
        showingInfoWindow: true
      })
    }
  }

  onMouseout = (props, marker, e) => {
    if (this.state.showingInfoWindow) {
      this.setState({
        selectedPlace: {},
        activeMarker: null,
        showingInfoWindow: false
      })
    }
  }
  */


  onClose = () => {
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

  // async componentDidMount() {
  //   const data = this.props.data
  //   this.setState({ data: data })
  // }

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
        // onClick={this.onClick}
        // onMouseover={this.onMouseover}
        // onMouseout={this.onMouseout}
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

  render() {
    return (
      <div className="Map-container">
        <Map
          google={this.props.google}
          zoom={4}
          maxZoom={7}
          minZoom={2.5}
          streetViewControl={false}
          mapTypeControl={false}
          backgroundColor={"white"}
          fullscreenControl={false}
        >
          {
            Object.keys(this.props.data).map((key, idx) => {
              return this.renderMarker(key, idx)
            })
          }
          {/*
          <InfoWindow
            marker={this.state.activeMarker}
            visible={this.state.showingInfoWindow}
            onClose={this.onClose}
          >
            <div>
              <h4>{this.state.selectedPlace.location}</h4>
              {this.state.selectedPlace.confirmed ?

                <p>{this.state.selectedPlace.confirmed - this.state.selectedPlace.Deaths - this.state.selectedPlace.Recovered} active case(s)</p>
                : <p></p>
              }
            </div>
          </InfoWindow>
            */}
        </Map >
      </div>
    );
  }
}

export default GoogleApiWrapper({
  apiKey: "AIzaSyD_K7emGffTR-zuCTIbDjRIfF4P_LwUEOs"
})(MapContainer)