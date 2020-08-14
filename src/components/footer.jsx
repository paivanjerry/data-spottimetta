import React, { Component } from "react";
import "../css/footer.css";
class Footer extends Component {
  render() {
    return (
      <div className="footer">
        <div className="vertical wrap_content">
          <a href="https://spottimetta.fi/webapp">Spottimettä web</a>
          <a href="https://play.google.com/store/apps/details?id=com.jerry.spottimett">Spottimettä Android</a>
          <a href="https://apps.apple.com/us/app/spottimett%C3%A4/id1508565237">Spottimettä iOS</a>
          <a href="https://www.instagram.com/spottimetta/">Instagram</a>
          <a href="https://www.distantskate.com">Distant S.K.A.T.E.</a>

        </div>
      </div>
    );
  }
}

export default Footer;
