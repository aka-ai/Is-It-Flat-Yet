import React, { Component } from 'react';
import Firebase from './Firebase';
class Countries extends Component {
  constructor(props) {
    super(props)
    this.state = {data: []}
  }

  async componentDidMount() {
    const data = await this.props.firebase.getData()
    this.setState({data: data})
  }
  render() {
    return (
      <div className="side-box">
        {this.state.data.map(region => (
          <p>{region.countryOrRegion}</p>
        ))}
      </div>
    )
  }
}

export default Countries