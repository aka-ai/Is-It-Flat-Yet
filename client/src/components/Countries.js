import React, { Component } from 'react';
// import Firebase from './Firebase';
import fakeData from '../fakeData.js'
class Countries extends Component {
  constructor(props) {
    super(props)
    this.state = { data: [] }
  }

  async componentDidMount() {
    // const data = await this.props.firebase.getData()
    const data = fakeData
    this.setState({ data: data })
  }
  render() {
    console.log(this.state.data)
    return (
      <div className="side-box">
        {this.state.data.map((region, idx) => (
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
            <p>{region.Confirmed} confirmed cases</p>
            <p>---</p>

          </div>
        ))}
      </div>
    )
  }
}

export default Countries

