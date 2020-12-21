import React, { Component } from "react";
import "../css/logo.css";
import { Link } from "react-router-dom";

class Logo extends Component {
  state = {};
  render() {
    return (
      <Link to="/">
        <img
          style={{minHeight: "336px", minWidth: "300px", background: "#f8f8f8", borderRadius: "20px"}}
          className="logo"
          src="/spottimettadataotsikko.gif"
          alt="Data spottimettä"
        />
      </Link>
    );
  }
  toHomePage() {
    window.location.pathname = "/";
  }
}
export default Logo;
