import React, { Component } from 'react'
import { slide as Menu } from 'react-burger-menu'

class Hamburger extends Component {

  // showSettings(event) {
  //   event.preventDefault();
  //   .
  //   .
  //   .
  // }

  render() {
    // SOURCE: https://github.com/negomi/react-burger-menu#styling
    return (
      <Menu>
        {Object.keys(this.props.data).map((location, idx) => {
          const data = this.props.data[location]
          const {
            confirmed,
            deaths,
            recovered,
            countryOrRegion,
            stateOrProvince
          } = data
          const active = (
            confirmed - deaths - recovered
          ).toString()
          return (
            <div key= { idx }>
              <h3>{stateOrProvince + '\n' + countryOrRegion}</h3>
              <p>active: {active}</p>
              <p>confirmed: {confirmed}</p>
              <p>recovered: {recovered}</p>
              <p>deaths: {deaths}</p>
            </div>
          )
        }
        )}
      </Menu>
    );
  }
}

export default Hamburger