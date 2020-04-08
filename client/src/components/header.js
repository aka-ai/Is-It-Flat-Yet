import React, { Component } from "react"
import { mildIcon, mediumIcon, severeIcon } from "./Map/MapIcons";
import dayjs from 'dayjs'

class Header extends Component {
  render() {

    return (
      <div className="header">
        <h2>Is It Flat Yet?</h2>
        <div className="headerInfo">
          <img className="responsive" alt="yellowPin" src={mildIcon} />
          <p>{"< 100 deaths"}</p>
          <img className="responsive" alt="orangePin" src={mediumIcon} />
          <p>100 - 1,000 deaths</p>
          <img className="responsive" alt="redPin" src={severeIcon} />
          <p>{"> 1,000 deaths"}</p>
        </div>
        <p>Last Updated: {dayjs(new Date()).format("M/D/YY")}</p>
      </div>
    )
  }
}
export default Header