import React, { Component } from 'react'
import { VictoryChart, VictoryArea, VictoryGroup, VictoryAxis } from "victory"
import { renderHistoricData } from './Map/BaseMapHelper'
class Graph extends Component {
  constructor(props) {
    super(props)
    this.state = { historyData: '', isLoading: true }
  }

 
  render() {
    let data
    if (this.props.entityData) {
      data = renderHistoricData(this.props.entityData)
    } else {
      data = renderHistoricData(this.props.usCountryData)
    }
    const { name, deltaDeaths, deltaConfirmed, confirmed, deaths, usCountryData } = data
    console.log('usCountryData', this.props)
    const axisStyle = {
      axisLabel: { fontSize: 8, padding: 10 },
      tickLabels: { fontSize: 6, padding: 3 },
    }
    const typesOfGraph = [
      ["Accumulative", [confirmed, deaths]],
      ["Delta", [deltaConfirmed, deltaDeaths]]
    ]
    //list of color names: https://www.w3schools.com/colors/colors_names.asp
    const colors = [['darkcyan', 'thistle'], ['gold', 'darkslateblue']]
    return (
      <div className="graph-container">
        <h1>Graph</h1>
        {typesOfGraph.map((category, categoryIdx) => {

          return (
            <div className="graph" key={categoryIdx} >
              <VictoryChart scale={{ x: "time", y: "sqrt" }} width={300} height={300} >

                <VictoryAxis
                  style={axisStyle}
                  label={`${name} ${category[0]}`}
                />
                <VictoryAxis dependentAxis
                  style={axisStyle}
                />
                <VictoryGroup >
                  {category[1].map((dataType, dataTypeIdx) => {
                    return (
                      <VictoryArea
                        style={{
                          data: {
                            fill: colors[categoryIdx][dataTypeIdx],
                          }
                        }}
                        interpolation={"natural"}
                        data={dataType}
                        key={dataTypeIdx}
                      />
                    )
                  })}
                </VictoryGroup>
              </VictoryChart  >
            </div>
          )
        })}
      </div>
    )
  }
}

export default Graph
// SOURCE: https://github.com/negomi/react-burger-menu#styling