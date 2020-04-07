import ReactDOM from 'react-dom'
import { InfoWindow } from "google-maps-react";

export default class InfoWindowW extends InfoWindow {
  renderInfoWindow() {
    InfoWindow.prototype.renderInfoWindow.call(this);
    this.elem = document.createElement("div");
  }
  renderChildren() {
    return this.elem;
  }
  render() {
    const { children } = this.props;
    return this.elem ? ReactDOM.createPortal(children, this.elem) : null;
  }
}