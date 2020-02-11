import React, { Component } from "react";
import CategoryChart from "./categoryChart";

class Categories extends Component {
  render() {
    return (
      <div>
        <h2>Kategoriat</h2>
        <CategoryChart
          data={this.props.data}
          dataKey="category"
        ></CategoryChart>
      </div>
    );
  }
}

export default Categories;
