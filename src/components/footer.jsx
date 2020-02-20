import React, { Component } from "react";
import "../css/footer.css";
class Footer extends Component {
  render() {
    return (
      <div className="footer">
        <div className="vertical">
          <a href="https://spottimetta.fi/webapp">Spottimettä web</a>
          <a href="https://play.google.com/store/apps/details?id=com.jerry.spottimett">Spottimettä Android</a>
          <a href="https://www.instagram.com/spottimetta/">Instagram</a>

        </div>
      </div>
    );
  }
}

export default Footer;
