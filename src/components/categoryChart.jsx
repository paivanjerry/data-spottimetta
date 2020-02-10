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
    console.log("KAAVIOSSA " + JSON.stringify(this.props.data));

    return (
         <ResponsiveContainer width="90%" height={600}>
      <BarChart
        width={700}
        height={500}
        data={this.props.data}
        margin={{
          top: 5,
          right: 30,
          left: 20,
          bottom: 5
        }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="category" />
        <YAxis />
        <Tooltip />
        <Legend />

        <Bar name="Määrä" dataKey="amount" fill="#00a732" />
      </BarChart>
      </ResponsiveContainer>
    );
  }
}

export default CategoryChart;
