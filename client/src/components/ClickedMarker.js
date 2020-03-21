import React, { Component } from 'react'
import { Marker } from 'google-maps-react'
import greenIcon from '../mapIcons/green.png'

export default class ClickedMarker extends Component {
  render () {
    console.log('HERE', this.props.selectedPlace.position)
    return (
      <Marker
        position={this.props.selectedPlace.position}
        icon={{url: greenIcon}}
      >
      </Marker>
    )
  }
}