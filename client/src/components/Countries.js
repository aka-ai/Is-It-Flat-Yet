/*
import React, { Component } from 'react';
// import Firebase from './Firebase';
import fakeData from '../fakeData.js'
class Countries extends Component {
  constructor(props) {
    super(props)
    this.state = { data: [] }
  }

  // async componentDidMount() {
  //   const data = this.props.data
  //   this.setState({ data: data })
  // }
  render() {
    return (
      <div className="side-box">
        {Object.keys(this.props.data).map((key, idx) => {
          const region = this.props.key
          return (
            <div key={idx}>
              {region.stateOrProvince ?
                <div>
                  <p>{region.countryOrRegion + '/' + region.stateOrProvince}</p>
                </div>
                :
                <div>
                  <p>{region.countryOrRegion}</p>
                </div>
              }
              <p>{parseInt(region.confirmed)} confirmed cases</p>
              <p>---</p>

            </div>
          )
        })}
      </div>
    )
  }
}

export default Countries

*/