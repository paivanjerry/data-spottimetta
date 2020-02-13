import React, { Component } from "react";
import "../css/openData.css";
import "../App.css";

class OpenData extends Component {
  state = {};
  render() {
    return (
      <React.Fragment>
        <h2>Avoin data</h2>
        <p className="margin">
          Spottimetän paikkojen data ladattavissa csv- tai json-tiedostona
          klikkaamalla alla olevista laatikoista.
        </p>
        <div className="openDataContainer noSelect">
          <div className="dataBox" onClick={this.downloadCsv.bind(this)}>
            <h3 className="noSelect">CSV</h3>
            <p className="noSelect">
              Tallenna spotit Excelillä luettavaan muotoon (csv). Tätä voi sit
              selailla, jos ei oo pääsyä Spottimettä sovellukseen syystä tai
              toisesta. Koordinaatit voit kopioida ja avata esimerkiksi
              <a
                href="http://www.copypastemap.com/"
                onClick={event => event.stopPropagation()}
              >
                täällä.
              </a>
            </p>
          </div>

          <div className="dataBox" onClick={this.downloadJson.bind(this)}>
            <h3 className="noSelect">JSON</h3>
            <p className="noSelect">
              Lataa json-tiedosto. Toimii näppärämmin sovelluksissa (hyviin
              tapoihin kuuluu ilmottaa mistä data on peräisin).
            </p>
          </div>
        </div>
      </React.Fragment>
    );
  }
  downloadJson() {
    console.log(this.props.data.data);
    let parsedStructure = {};
    for (let spot in this.props.data.data) {
      let spotData = this.props.data.data[spot];
      delete spotData.ID;
      parsedStructure[spot] = spotData;
    }
    this.download("spottimetta.json", JSON.stringify(parsedStructure));
  }

  downloadCsv() {
    let content = "";
    for (let spot in this.props.data.data) {
      let spotData = this.props.data.data[spot];
      content += spotData.LAT;
      content += ";";
      content += spotData.LON;
      content += ";";
      content += spot;
      content += ";";
      content += spotData.KUVAUS;
      content += ";";
      content += spotData.KUVAT;
      content += ";";
      content += spotData.TYYPPI;
      if (spotData.KOMMENTIT) {
        content += ";" + spotData.KOMMENTIT;
      }
      content += "\n";
    }
    this.download("spottimetta.csv", content);
  }

  download(filename, text) {
    let element = document.createElement("a");
    element.setAttribute(
      "href",
      "data:text/plain;charset=utf-8," + encodeURIComponent(text)
    );
    element.setAttribute("download", filename);

    element.style.display = "none";
    document.body.appendChild(element);

    element.click();

    document.body.removeChild(element);
  }
}

export default OpenData;
