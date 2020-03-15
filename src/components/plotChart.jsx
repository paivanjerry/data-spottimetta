import React, { Component } from "react";
import {
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  ReferenceDot,
  Brush
} from "recharts";

let yOffset = 50;


class PlotChart extends Component {

  render() {
    return (
      <ResponsiveContainer width="90%" height={600}>
        <LineChart
          
          data={this.props.data}
          margin={{ top: 5, right: 20, bottom: 5, left: 0 }}
        >
          <Line
            animationDuration={850}
            isFront="true"
            name={this.props.xAxisName}
            type="monotone"
            dataKey="amount"
            stroke="#0073e6"
            strokeWidth="2"
            dot={this.props.dot}
            activeDot={{ stroke: "green", fill: "green", strokeWidth: 2, r: 5 }}
          />
          <Brush dataKey="date" height={100}/>
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
  getChangeOffset() {
    if (yOffset > 290) {
      yOffset = 50;
    } else {
      yOffset += 20;
    }
    return yOffset;
  }
}

export default PlotChart;
