import React, { Component } from 'react';

class Countries extends Component {
  constructor() {
    super()
    this.state = {items: ''}
  }

  render () {
    return (
      <div className="side-box">
        <h1>countries list</h1>
      </div>
    )
  }
}

export default Countries