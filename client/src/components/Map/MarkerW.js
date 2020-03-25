import { Marker } from 'google-maps-react';

export default class MarkerW extends Marker {
  shouldComponentUpdate(nextProps, nextState) {
    return false
  }
}
