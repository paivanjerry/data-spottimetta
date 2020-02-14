import React, { Component } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  Cell,
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
            dataKey={this.props.yDataKey ?? "amount"}
            fill="#00a732"
          >
            { this.props.data !== undefined ? this.props.data.map((entry, index) =>
              this.coloredCell(entry, index)
            ):""}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    );
  }
  print(a, b) {
    console.log(JSON.stringify(a.color) + " - " + b);
  }
  coloredCell(entry, index) {
    if (entry.color) {
      return <Cell key={`cell-${index}`} fill={entry.color} stroke="grey" />;
    } else {
      return;
    }
  }
}

export default CategoryChart;
