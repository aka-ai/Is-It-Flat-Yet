import React, { Component } from 'react';
// import Firebase from './Firebase';
import { object } from 'prop-types';
class Countries extends Component {
  constructor(props) {
    super(props)
    this.state = { data: [] }
  }
  render() {
    const sumData = {countryLevel: {}, stateLevel: {}, decendingSortedCountryLevel: [], globalTotalConfirmed: 0}
    Object.keys(this.props.data).map((key, idx) => {
      const data = this.props.data[key]
      if (!sumData["countryLevel"][data.countryOrRegion]) {
        sumData["countryLevel"][data.countryOrRegion] = data.confirmed
      } else {
        sumData["countryLevel"][data.countryOrRegion] += data.confirmed
        sumData["globalTotalConfirmed"] += data.confirmed
      }
    })
 
    return (
      <div>
        <h1>Total Global Confirmed Cases  {sumData["globalTotalConfirmed"]}</h1>
        {/* {Object.keys(this.props.data).map((key, idx) => {
          const data = this.props.data[key]
          const {
            confirmed,
            deaths,
            recovered,
            countryOrRegion,
            stateOrProvince
          } = data

          return (
            <div key={idx}>
              {stateOrProvince ?
                <div>
                  <p>{countryOrRegion + '/' + stateOrProvince}</p>
                </div>
                :
                <div>
                  <p>{countryOrRegion}</p>
                </div>
              }
              <p>{confirmed} confirms</p>
              <p>{deaths} deaths</p>
              <p>{recovered} recovered</p>

              <p>---</p>

            </div>
          )
        })} */}
      </div>
    )
  }
}

export default Countries
