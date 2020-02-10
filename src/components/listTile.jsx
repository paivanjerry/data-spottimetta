import React, { Component } from "react";
import "../css/list.css";

class ListTile extends Component {
  render() {
    return (
      <tr className="tableRow">
        <td>
          <img
            className="listImage"
            src={this.props.object.image}
            alt="data type icon"
          />
        </td>

        <td>
          <div className="vertical">
            <span className="listSpan">{this.props.object.title}</span>
            <span className="listanKuvaus">{this.props.object.description}</span>
          </div>
        </td> 
 
        <td>
          <span> Reeaaaliaikaainen</span>
        </td>
      </tr>
    );
  }
}

export default ListTile;
