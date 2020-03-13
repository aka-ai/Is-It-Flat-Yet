import React, { Component } from 'react'


class Data extends Component {
  render() {
    let location, confirmed, deaths, recovered, country, active 
    
    if (!this.props.clickedLocation.confirmed) {
      country = "World Wide"
      confirmed = 2000
      deaths = 100
      recovered = 30
      active = confirmed - deaths - recovered
    } else {
      ({ location, confirmed, deaths, recovered, country } = this.props.clickedLocation)
      active = confirmed - deaths - recovered
    }

    return (
      <div className="side-box">
        {!location ? <h3>{country}</h3>
          : <h3>{location}, {country}</h3>
          }
        <h4>Active: {active}</h4>
        <p>Infected: {confirmed}</p>
        <p>Recovered: {recovered}</p>
        <p>Death: {deaths}</p>
      </div>
    )
  }
}

export default Data


