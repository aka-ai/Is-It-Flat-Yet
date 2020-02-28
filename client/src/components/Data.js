import React, { Component } from 'react'
import fakeData from '../fakeData.js'
class Data extends Component {
  render() {
    return (
      <div>
        {fakeData.map((data) => (
          <div key={data.Id}>
            <h1>{data.Country}</h1>
            <div>
              {data.RegionalData.map((region) => (
                <div>
                  <h2>{region.Region}</h2>
                    <div>
                      {region.Confirmed.map((dailyCase) => (
                        <div>
                          <p>{dailyCase.date}</p>
                          <p>{dailyCase.dailyTotal}</p>
                        </div>
                      ))}
                    </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    )
  }
}

export default Data


