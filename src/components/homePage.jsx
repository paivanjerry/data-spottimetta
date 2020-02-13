import React, { Component } from "react";
import List from "./list";
import "../App.css";

class HomePage extends Component {
  state = {};
  render() {
    return (
      <div>
        <List listItems={this.props.listItems}></List>
      </div>
    );
  }
}

export default HomePage;
