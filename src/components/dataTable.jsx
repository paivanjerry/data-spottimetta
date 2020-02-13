import React, { Component } from "react";
import "../css/dataTable.css";

class DataTable extends Component {
  state = {};

  render() {
    return (
      <div>
        <table className="dataTable">
          <thead>
            <tr>
              <th>{this.props.leftTitle}</th>
              <th>{this.props.rightTitle}</th>
            </tr>
          </thead>

            <tbody>

            
          {this.props.data ? this.props.data.map((wordElement, index) => (
            <tr key={index}>
              <td>{wordElement[0]}</td>
              <td>{wordElement[1]}</td>
            </tr>
          )): ""}
</tbody>
        </table>
      </div>
    );
  }
}

export default DataTable;
