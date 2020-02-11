import React, { Component } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from "recharts";

class CategoryChart extends Component {
  render() {
    return (
      <ResponsiveContainer width="90%" height={600}>
        <BarChart
          data={this.props.data}
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 5
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey={this.props.dataKey} />
          <YAxis />
          <Tooltip />
          <Legend />

          <Bar
            name={this.props.xAxisName ?? "Määrä"}
            dataKey={this.props.yDataKey ??"amount"}
            fill="#00a732"
          />
        </BarChart>
      </ResponsiveContainer>
    );
  }
}

export default CategoryChart;
