import React, { Component } from 'react';
import Firebase from './Firebase';
class Countries extends Component {
  constructor(props) {
    super(props)
    this.state = { data: [] }
  }

  async componentDidMount() {
    const data = await this.props.firebase.getData()
    this.setState({ data: data })
  }
  render() {
    console.log(this.state.data)
    return (
      <div className="side-box">
        {this.state.data.map((region, idx) => (
          <div >
            {region.stateOrProvince ?
              <div key={idx}>
                <p>{region.countryOrRegion + '/' + region.stateOrProvince}</p>
              </div>
              :
              <div key={idx}>
                <p>{region.countryOrRegion}</p>
              </div>
            }

          </div>
        ))}
      </div>
    )
  }
}

export default Countries