import React, { Component } from 'react';

export default class InfoWindowW extends Component {
  render() {
    const {
      location,
      country,
      confirmed,
      deaths,
      recovered
    } = this.props.marker
    if (country) country = country.toUpperCase()
    if (location) location = location.toUpperCase()

    return (
        <div>
          {!location ? <h4>{country}</h4>
            :
            <h4>{location} {country}</h4>}
          {confirmed ?
            <p>{confirmed - deaths - recovered} Active Cases</p>
            : <p></p>
          }
          <p>{confirmed} Total Confirmed</p>
          <p>{recovered} Recovered</p>

          <p>{deaths} {deaths === 1 ? "Death" : "Deaths"}</p>
        </div>
    )
  }
}