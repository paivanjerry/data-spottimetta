import React, { Component } from "react";
import "../css/list.css";
import "../App.css";

class ListTile extends Component {
  render() {
    return (
      <tr
        className={this.props.className + " tableRow"}
        onClick={() => this.changePath(this.props.object.path)}
      >
        <td className="listImage">
          <div className="vertical listImage">
            <img
              height="80px"
              width="80px"
              className="listImage"
              src={this.props.object.image}
              alt="data type icon"
            />
          </div>
        </td>

        <td>
          <div className="vertical">
            <span className="listTitle tableCenter">
              {this.props.object.title}
            </span>

            <span className="listDescription">
              {this.props.object.description}
            </span>
          </div>
        </td>

        <td>
          <span className="tableUpdated">
            {this.props.object.updated === -1
              ? "-"
              : this.props.object.updated}
          </span>
        </td>
      </tr>
    );
  }
  changePath(path) {
    document.getElementById(path).click();
  }
}

export default ListTile;
