import React from "react";
import { InfoWindow, Marker } from 'google-maps-react';

export default class MarkerW extends Marker {
  shouldComponentUpdate(nextProps, nextState) {
    if (
      this.props.map !== nextProps.map ||
      this.props.icon.url !== nextProps.icon.url ||
      (
        this.props.position.lat !== nextProps.position.lat ||
        this.props.position.lng !== nextProps.position.lng
      )
    ) {
      return true
    } else {
      return false
    }
  }

  // TODO decide whether to use shouldComponentUpdate or componentDidUpdate
  // componentDidUpdate(prevProps) {
  //   if (
  //     this.props.map !== prevProps.map ||
  //     this.props.icon.url !== prevProps.icon.url ||
  //     (
  //       this.props.position.lat !== prevProps.position.lat ||
  //       this.props.position.lng !== prevProps.position.lng
  //     )
  //   ) {
  //     if (this.marker) {
  //       this.marker.setMap(null);
  //     }
  //     this.renderMarker();
  //   }
  // }
}
