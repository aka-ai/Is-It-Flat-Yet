import React, { Component } from "react"
import redPin from '../mapIcons/red.png'
import orangePin from '../mapIcons/orange.png'
import yellowPin from '../mapIcons/yellow.png'

class Header extends Component {
  render() {
    return (
      <div className="header">
        <h1>Coronavirus Confirmed Active Cases</h1>
        <div className="headerInfo">
          <img className="responsive" alt="yellowPin" src={yellowPin} />
          <p>{"< 1000 cases"}</p>
          <img className="responsive" alt="orangePin" src={orangePin} />
          <p>1000 - 10,000 cases</p>
          <img className="responsive" alt="redPin" src={redPin} />
          <p>{"> 10,000 cases"}</p>
        </div>
      </div>
    )
  }
}
export default Header