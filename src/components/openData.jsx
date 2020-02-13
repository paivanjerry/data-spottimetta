import React, { Component } from "react";
import "../css/openData.css";
import "../App.css";

class OpenData extends Component {
  state = {};
  render() {
    return (
      <React.Fragment>
        <h2>Avoin data</h2>
        <p className="bodyText m20b">
          Spottimetän paikkojen data ladattavissa csv- tai json-tiedostona
          klikkaamalla alla olevista laatikoista. Data on lisensoitu{" "}
          <a href="https://creativecommons.org/licenses/by/4.0/deed.fi">
            Creative commons 4.0 kansainvälinen
          </a>
          &nbsp;lisenssillä. Käyttö on vapaata (myös kaupallisesti), kunhan
          ilmoitat tietojen alkuperän.
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
              Lataa json-tiedosto. Toimii näppärämmin sovelluksissa.
            </p>
          </div>
        </div>
      </React.Fragment>
    );
  }
  downloadJson() {
    let spotObj = {};
    let parsedStructure = {
      license:
        "Tämä teos on lisensoitu Creative Commons Nimeä 4.0 Kansainvälinen -lisenssillä. Tarkastele lisenssiä osoitteessa http://creativecommons.org/licenses/by/4.0/ tai lähetä kirje osoitteeseen Creative Commons, PO Box 1866, Mountain View, CA 94042, USA."
    };
    for (let spot in this.props.data.data) {
      let spotData = this.props.data.data[spot];
      delete spotData.ID;

      spotObj[spot] = spotData;
    }
    parsedStructure["spots"] = spotObj;
    this.download("spottimetta.json", JSON.stringify(parsedStructure));
  }

  downloadCsv() {
    let content =
      "leveysaste;korkeusaste;otsikko;kuvaus;kuvat(erotettu välilyönneillä);tyyppi;kommentit;lisenssi-->;Tämä teos on lisensoitu Creative Commons Nimeä 4.0 Kansainvälinen -lisenssillä. Tarkastele lisenssiä osoitteessa http://creativecommons.org/licenses/by/4.0/ tai lähetä kirje osoitteeseen Creative Commons, PO Box 1866, Mountain View, CA 94042, USA.\n";

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
