import React, { Component } from "react";
import PlotChart from "./plotChart";

class AppPage extends Component {
  render() {
    // Rekisteröitymisiä
    return (
      <div>
        <h2 className="bodyText">{this.props.situation}</h2>
        <p className="graphDescription bodyText">Laitteille asennetut viimeisen kuukauden sisällä avatut Android-sovellukset. Data on kerätty koko Android-sovelluksen elinkaaren ajalta ja sitä päivitetään sivuille manuaalisesti. Tässä kuvaajassa näkyy vihreinä palloina sovellusversioiden julkaisuhetket.</p>
        <PlotChart
          dot={this.props.dot}
          data={this.props.data}
          xAxisName="Asennuksia"
        ></PlotChart>

        <h2 className="bodyText m50t">Lataukset päivittäin</h2>
        <p className="graphDescription bodyText">
          Kaavioon lisätty vain käyttäjät, jotka eivät ole aiemmin ladanneet
          sovellusta. Data on koko sovelluksen elinkaaren ajalta.
        </p>
        <PlotChart
          dot={this.props.dot}
          data={this.props.data2}
          xAxisName="Latauksia"
        ></PlotChart>
      </div>
    );
  }
}

export default AppPage;
