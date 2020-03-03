import React, { Component } from 'react'
import fakeData from '../fakeData'


class Data extends Component {

  render() {

    return (
      <div>
        {fakeData.map((data, idx) => (
          <div key={idx}>
            <h3>{data["Province/State"]} {data["Country/Region"]}</h3>
            <p>Confirmed: {data.Confirmed}</p>
            <p>Deaths: {data.Deaths}</p>
            <p>Recovered: {data.Recovered}</p>
            <p>Active: {data["Confirmed"]-data["Recovered"]-data["Deaths"]}</p>
          </div>
        ))}
      </div>
    )
  }
}

export default Data


