import React, { Component } from "react";
import "../css/list.css";

class ListTile extends Component {
  render() {
    return (
      <tr className={this.props.className + " tableRow"} onClick={()=>this.changePath(this.props.object.path)}>
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
          <span>{this.props.object.updated === -1 ? "Nyt" : this.props.object.updated}</span>
        </td>
      </tr>
    );
  }
  changePath(path){
    window.location.pathname = "/" + path;
  }

}

export default ListTile;
