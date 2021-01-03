import React, { Component } from "react";
import "../css/logo.css";
import { Link } from "react-router-dom";
import logoImg from '../images/spottimettadataotsikko.gif'
class Logo extends Component {
  state = {};
  render() {
    return (
      <Link to="/">
        <img
          style={{minHeight: "336px", minWidth: "300px", background: "#f8f8f8", borderRadius: "20px"}}
          className="logo"
          src={logoImg}
          alt="Data spottimettä logo"
        />
      </Link>
    );
  }
  toHomePage() {
    window.location.pathname = "/";
  }
}
export default Logo;
