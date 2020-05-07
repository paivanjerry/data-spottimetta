import React, { Component } from "react";
import PlotChart from "./plotChart";
import DualChart from "./dualChart";

class AppPage extends Component {
  render() {
    // Rekisteröitymisiä
    return (
      <div>
        <h2 className="bodyText">{this.props.situation}</h2>
        <p className="graphDescription bodyText">
          Laitteille asennetut viimeisen kuukauden sisällä avatut
          Android-sovellukset. Data on kerätty koko Android-sovelluksen
          elinkaaren ajalta ja sitä päivitetään sivuille manuaalisesti. Tässä
          kuvaajassa näkyy vihreinä palloina Android sovellusversioiden
          julkaisuhetket.
        </p>
        <PlotChart
          dot={this.props.dot}
          data={this.props.data}
          xAxisName="Asennuksia"
        ></PlotChart>

        <h2 className="bodyText m50t">Lataukset päivittäin</h2>
        <p className="graphDescription bodyText">
          Kaavio sisältää myös käyttäjät, jotka ovat aikaisemmin ladanneet
          sovelluksen. Dataa iOS ja Android sovelluksista.
        </p>
        <DualChart
          dot={this.props.dot}
          data={[
            { name: "Android", data: this.props.data2 },
            { name: "iOS", data: this.props.appUnits },
          ]}
        ></DualChart>


        <h2 className="bodyText m50t">iOS sovelluksen päivän sessareiden keskiarvo</h2>
        <p className="graphDescription bodyText">
          Kuvaaja kertoo kuinka monta kertaa päivän aikana sovelluksen avannut henkilö avaa keskimäärin sovelluksen samana päivänä. Otos sisältää dataa vain noin viidennekseltä sovelluksen käyttäjistä (, eli ne jotka sallivat asetuksista tiedon jaon sovellukseen). Keskiarvokuvaajassa se ei kuitenkaan vääristä liikaa. Kuitenkaan tämän ongelman takia esim. iOS asennusten määrää ei voida tietää tarkalleen.
        </p>
        <PlotChart
          dot={this.props.dot}
          data={this.props.iosSessions}
          xAxisName="Sessareita"
        ></PlotChart>

      </div>
    );
  }
}

export default AppPage;
