import React from 'react'
import ReactDOM from 'react-dom'

export class CurrentLocation extends React.Component {
  constructor(props) {
    super(props)

    const { lat, lng } = this.props.initialCenter
    this.state = {
      CurrentLocation: {
        lat: lat,
        lng: lng
      }
    }
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevProps.google !== this.props.google) {
      this.recenterMap()
    }
    if (prevState.CurrentLocation !== this.state.CurrentLocation) {
      this.recenterMap()
    }
  }

  recenterMap() {
    const map = this.map
    const current = this.state.CurrentLocation

    const google = this.props.google
    const maps = google.maps

    if (map) {
      let center = new maps.LatLng(current.lat, current.lng)
      map.panTo(center)
    }
  }

  componentDidMount() {
    if (this.props.centerAroundCurrentLocation) {
      if (navigator && navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(pos => {
          const coords = pos.coords
          this.setState({
            CurrentLocation: {
              lat: coords.latitude,
              lng: coords.longitude
            }
          })
        })
      }
    }
    this.loadMap()
  }

  loadMap() {
    if (this.props && this.props.google) {
      //checks if google is available
      const { google } = this.props
      const maps = google.maps

      const mapRef = this.refs.map

      //reference to the actual DOM element
      const node = ReactDOM.findDOMNode(mapRef)

      let { zoom } = this.props
      const { lat, lng } = this.state.CurrentLocation
      const center = new maps.LatLng(lat, lng)
      const mapConfig = Object.assign(
        {},
        {
          center: center,
          zoom: zoom
        }
      )

      //maps.Map() is constructor that instantiates the map
      this.map = new maps.Map(node, mapConfig)
    }
  }

  //ensure that our previous Marker picks our current location ie the browsers current location
  renderChildren() {
    const { children } = this.props

    if (!children) return

    return React.Children.map(children, c => {
      if (!c) return
      return React.cloneElement(c, {
        map: this.map,
        google: this.props.google,
        mapCenter: this.state.CurrentLocation
      })
    })
  }

  render() {
    return (
      <div>
        <div className="Map-container" ref="map">
          Loading map...
        </div>
        {this.renderChildren()}
      </div>
    )
  }
}

export default CurrentLocation

CurrentLocation.defaultProps = {
  zoom: 12,
  initialCenter: {
    lat: 47.6062,
    lng: -122.3321
  },
  centerAroundCurrentLocation: true,
  visible: true
}