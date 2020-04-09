import React, { Component } from "react"
import { mildIcon, mediumIcon, severeIcon } from "./Map/MapIcons";
import dayjs from 'dayjs'

class Header extends Component {
  render() {

    return (
      <div className="header">
        <h1>CORONAVIRUS</h1> <h2>- Is It Flat Yet -</h2>
        <h3 style={{color:"#6c6b6b"}}>click a marker to see its curve</h3>
        <p>Last Updated: {dayjs(new Date()).format("M/D/YY")}</p>
      </div>
    )
  }
}
export default Header