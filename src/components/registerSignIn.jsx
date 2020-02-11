import React, { Component } from "react";
import PlotChart from "./plotChart";

class RegisterSignIn extends Component {
  render() {
    // Rekisteröitymisiä
    return (
      <div>
        <h2>{this.props.situation}</h2>
        <p className="graphDescription">{this.props.description}</p>
        <PlotChart
          data={this.props.data}
          xAxisName={this.props.situation}
        ></PlotChart>
      </div>
    );
  }
}

export default RegisterSignIn;
