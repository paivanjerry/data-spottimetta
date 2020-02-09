import React, { Component } from "react";
import Logo from "../components/logo";

import List from "../components/list";

class HomePage extends Component {

  state = {

  };
  render() {
    return (
      <div>
        <Logo></Logo>
        
        <List
        ></List>
      </div>
    );
  }
}

export default HomePage;
