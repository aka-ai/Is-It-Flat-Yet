import React, { Component } from "react"

class Footer extends Component {
  render() {
    return (
      <div className="footer">
        <div className="innerFooter">
          <p>Sources: <a rel="noopener noreferrer" href="https://github.com/CSSEGISandData/COVID-19/" target="_blank">Johns Hopkins</a>, <a rel="noopener noreferrer" href="https://covidtracking.com/" target="_blank">The COVID Tracking Project</a></p>
        </div>
        <div className="innerFooter">
          <p>Made By <a target="_blank" href="https://twitter.com/aicooks">@aicooks</a> and <a target="_blank" href="https://twitter.com/kahdojay">@kahdojay</a></p>
        </div>
      </div>
    )
  }
}
export default Footer