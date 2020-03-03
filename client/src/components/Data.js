import React, { Component } from 'react'

class Data extends Component {
  constructor(props) {
    super(props)
  }

  render() {
    const { location, confirmed, deaths, recovered, country } = this.props.clickedLocation
    const active = confirmed - deaths - recovered
    return (
      <div>
        <h3>{location}, {country}</h3>
        <h4>Active: {active}</h4>
        <p>Infected: {confirmed}</p>
        <p>Death: {deaths}</p>
      </div>
    )
  }
}

export default Data


