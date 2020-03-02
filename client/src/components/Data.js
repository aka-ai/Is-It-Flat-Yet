import React, { Component } from 'react'
import fakeData from '../fakeData'


class Data extends Component {

  render() {
    return (
      <div>
        {fakeData.map(data => (
          <div>
            <h3>{data["Province/State"]} {data["Country/Region"]}</h3>
            <p>Confirmed: {data.Confirmed}</p>
            <p>Deaths: {data.Deaths}</p>
            <p>Recovered: {data.Recovered}</p>
          </div>
        ))}
      </div>
    )
  }
}

export default Data


