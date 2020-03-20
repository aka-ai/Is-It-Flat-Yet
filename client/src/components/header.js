import React, { Component } from "react"
import redPin from '../mapIcons/red.png'
import orangePin from '../mapIcons/orange.png'
import yellowPin from '../mapIcons/yellow.png'

class Header extends Component {
  render() {
    return (
      <div className="header">
        <h1>Welcome to Coronavirus.show</h1>
        <h3>Coronavirus current cases (confirmed - deaths - recovered)</h3>
        <p>source: <a rel="noopener noreferrer" href="https://github.com/CSSEGISandData/COVID-19/" target="_blank">Johns Hopkins</a></p>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <img alt="yellowPin" src={yellowPin} />
          <p>less than 100 cases</p>
          <img alt="orangePin" src={orangePin} />
          <p>between 100 - 999 cases</p>
          <img alt="redPin" src={redPin} />
          <p>more than 1,000 cases</p>
        </div>
      </div>
    )
  }
}
export default Header