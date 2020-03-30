import React, { Component } from "react"
// import redPin from '../mapIcons/red.png'
import { mildIcon, mediumIcon, severeIcon } from "./Map/MapIcons";
// import orangePin from '../mapIcons/orange.png'
// import yellowPin from '../mapIcons/yellow.png'

class Header extends Component {
  render() {
    // console.log('icons: ', mildIcon, mediumIcon, severeIcon)
    return (
      <div className="header">
        <h1>Coronavirus Confirmed Deaths</h1>
        <div className="headerInfo">
          <img className="responsive" alt="yellowPin" src={mildIcon} />
          <p>{"< 100 deaths"}</p>
          <img className="responsive" alt="orangePin" src={mediumIcon} />
          <p>100 - 1,000 deaths</p>
          <img className="responsive" alt="redPin" src={severeIcon} />
          <p>{"> 1,000 deaths"}</p>
        </div>
        <p>Last Updated: {this.props.lastUpdated}</p>
      </div>
    )
  }
}
export default Header