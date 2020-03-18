import React, { Component } from 'react';
// import Firebase from './Firebase';
import fakeData from '../fakeData.js'
class Countries extends Component {
  constructor(props) {
    super(props)
    this.state = { data: [] }
  }
  render() {
    return (
      <div>
        <h1>Countires Data</h1>
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
