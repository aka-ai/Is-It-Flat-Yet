import React, { Component } from "react"
import { mildIcon, mediumIcon, severeIcon } from "./Map/MapIcons";
import dayjs from 'dayjs'

class Header extends Component {
  render() {

    return (
      <div className="header">
        <h1>CORONAVIRUS</h1> <h2>- Is It Flat Yet -</h2>
        <h3>click a marker to see its curve</h3>
      </div>
    )
  }
}
export default Header