import React, { Component } from 'react'
import { VictoryChart, VictoryArea, VictoryGroup, VictoryAxis } from "victory"
class Graph extends Component {
  constructor(props) {
    super(props)
    this.state = { historyData: '', isLoading: true }
  }

  renderData() {
    let name
    if (this.props.entityData) name = this.props.entityData.displayName
    const mapKeys = { deltaDeaths: [], deltaConfirmed: [], confirmed: [], deaths: [] }

    if (this.props.entityData) {
      const entityData = this.props.entityData
      Object.keys(mapKeys).forEach(category => {
        let dayOfYear, value
        entityData[category].forEach(d => {
          if (entityData.countryOrRegion === "US") {
            dayOfYear = new Date(Object.keys(d)[0])
            value = Object.values(d)[0] || 0
          } else {
            dayOfYear = new Date(d.date)
            value = parseInt(d.val)
          }
          mapKeys[category].push({ x: dayOfYear, y: value })
        })
      })
    }
    return {
      name: name,
      deltaDeaths: mapKeys.deltaDeaths,
      deltaConfirmed: mapKeys.deltaConfirmed,
      confirmed: mapKeys.confirmed,
      deaths: mapKeys.deaths
    }
  }
  render() {

    const { name, deltaDeaths, deltaConfirmed, confirmed, deaths } = this.renderData()
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
        {typesOfGraph.map((category, categoryIdx) => {

          return (
            <div className="graph">
            <VictoryChart scale={{ x: "time", y: "sqrt" }} width={300} height={300} key={categoryIdx} >

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
                          // stroke: colors[categoryIdx][dataTypeIdx],
                          // strokeWidth: 0,
                          // fillOpacity: 0.5
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
            </div>)
        })}
      </div>
    )
  }
}

export default Graph
// SOURCE: https://github.com/negomi/react-burger-menu#styling