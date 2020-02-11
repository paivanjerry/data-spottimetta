import React, { Component } from "react";
import "../css/logo.css";
import { Link } from "react-router-dom";

class Logo extends Component {
  state = {};
  render() {
    return (
      <Link to="/">
        <img
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
