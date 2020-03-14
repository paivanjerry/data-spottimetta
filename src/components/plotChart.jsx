import React, { Component } from "react";
import {
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  ReferenceDot
} from "recharts";

let xOffset = 50;
class PlotChart extends Component {
  
  render() {
    return (
      <ResponsiveContainer width="90%" height={600}>
        <LineChart
          data={this.props.data}
          margin={{ top: 5, right: 20, bottom: 5, left: 0 }}
        >
          <Line
            isFront="true"
            name={this.props.xAxisName}
            type="monotone"
            dataKey="amount"
            stroke="#0073e6"
            strokeWidth="2"
            dot={this.props.dot}
            activeDot={{ stroke: "green", fill: "green", strokeWidth: 2, r: 5 }}
          />
          {this.props.data
            ? this.props.data.map((dataElement, index) =>
                this.getRefDot(dataElement, index)
              )
            : ""}

          <CartesianGrid stroke="#ccc" strokeDasharray="5 5" />
          <XAxis dataKey="date" />
          <YAxis dataKey="amount" name={this.props.xAxisName + " - "} />
          <Tooltip />
        </LineChart>
      </ResponsiveContainer>
    );
  }
  getRefDot(dataElement, index) {

    if (dataElement.info) {
      return (
        <ReferenceDot
          key={dataElement.date}
          x={dataElement.date}
          y={this.getChangeOffset()}
          fill="lightgreen"
          fillOpacity="0.5"
          
          label={this.props.data[index].info}
          isFront="false"
        />
      );
    }
  }
  getChangeOffset(){
    if(xOffset > 290){
      xOffset = 50;
    }
    else{
      xOffset += 20;
    }
    return xOffset;
  }
}

export default PlotChart;
