import React, { Component } from 'react'
import { reveal as Slide } from 'react-burger-menu'
import { VictoryChart } from "victory"

class SidePanel extends Component {
  
  constructor(props) {
    super(props)
    this.state = {singleHistoryData: null}
  }
  
  async componentDidMount() {
    const historyData = await this.props.firebase.getHistoryData('us-tx')
    this.setState({singleHistoryData: historyData})
    
  }
  
  render() {
    if (this.state.singleHistoryData) console.log(this.state.singleHistoryData.deltaDeaths)
    return (
      <Slide>
        <p>side bar</p>
      </Slide>
    );
  }
}

export default SidePanel 
// SOURCE: https://github.com/negomi/react-burger-menu#styling