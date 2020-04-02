import React, { Component } from 'react'
import { reveal as Slide } from 'react-burger-menu'
import Graph from './Graph'

class SidePanel extends Component {
  
  constructor(props) {
    super(props)
  }

  
  render() {
    return (
      <Slide>
        <Graph firebase={this.props.firebase} />
      </Slide>
    );
  }
}

export default SidePanel 
// SOURCE: https://github.com/negomi/react-burger-menu#styling