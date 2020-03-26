import React, { Component } from "react"
import redPin from '../mapIcons/red.png'
import orangePin from '../mapIcons/orange.png'
import yellowPin from '../mapIcons/yellow.png'

class Header extends Component {
  render() {
    return (
      <div className="header">
        <h1>Coronavirus Confirmed Active Cases</h1>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <img alt="yellowPin" src={yellowPin} />
          <p>less than 1000 cases</p>
          <img alt="orangePin" src={orangePin} />
          <p>between 1000 - 10,000 cases</p>
          <img alt="redPin" src={redPin} />
          <p>more than 10,000 cases</p>
        </div>
      </div>
    )
  }
}
export default Header