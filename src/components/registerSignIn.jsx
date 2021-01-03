import React, { Component } from "react";
import PlotChart from "./plotChart";
import CumulativeSlider from "./cumulativeSlider";

class RegisterSignIn extends Component {
constructor(props) {
  super(props);

  this.state = {
    sliderValue: 30
  }
}


  render() {
    // Rekisteröitymisiä tai kirjautumisia
    return (
      <div>
        <h2 className="bodyText">{this.props.situation}</h2>
        <p className="graphDescription bodyText">{this.props.description}</p>
        <PlotChart
          data={this.props.data}
          xAxisName={this.props.situation}
        ></PlotChart>

        {this.getAnotherGraph()}
        {<CumulativeSlider unit={(this.props.register ? "Rekisteröityneitä" : "Kirjautuneita")} title={(this.props.register ? "Rekisteröityneet" : "Kirjautuneet") + " käyttäjät viimeisen X päivän aikana"} desc={"Valitse menneiden päivien määrä ja laskuri kertoo kuinka moni on " + (this.props.register ? "rekisteröitynyt" : "kirjautunut") + " kyseisellä aikavälillä."} data={this.props.data} />}
        
      </div>
    );
    
    }
    getCumulativeCounter(){
      return (
      <div className="m50t">
        <div className="sliderContainer">
          <h3>Kirjautuneet käyttäjät viimeisen X päivän aikana</h3>
          <p>
            Valitse menneiden päivien määrä ja laskuri kertoo kuinka moni on kirjautunut kyseisellä aikavälillä.
          </p>
          <input
            id="spotRange"
            type="range"
            min="1"
            max="365"
            step="1"
            value={this.state.sliderValue}
            onChange={event => {
              this.setState({ sliderValue: parseInt(event.target.value) });
            }}
          ></input>
          <p className="distLabel m5r inline">Viimeiset</p>
          <input
            id="numberBox"
            type="number"
            className="value inline"
            max="365"
            min="1"
            value={this.state.sliderValue}
            onChange={event => {
              this.setState({ sliderValue: parseInt(event.target.value) });
            }}
            step="1"
          />
          <p className="inline m5l">päivää</p>
          <br />
          <button
            className="button"
          >
            Laske
          </button>
          <br />
          <p className="inline">Kirjautuneita:</p>
          <p className="inline m5l">
            <b>{(this.state.calculatedSignedAmount || "ei laskettu") }&nbsp;</b>{"(" + this.state.sliderValue + "pv)"}
          </p>
        </div>
      </div>)
    }

    getAnotherGraph(){
      if(this.props.signInHistory){
        return (
          <div>
          <h2 className=" m50t bodyText">Kirjautumiset päivittäin</h2>
          <p className="graphDescription bodyText">Kuvaajassa näkyy kyseisen päivän aikana kirjautuneet käyttäjät. Vanhat ajankohdat ei laske käyttäjän kirjautuessa uudestaan.
          <br/>Punainen poikittainen viiva näyttää kuvaajan keskiarvon. Vihreä viiva viimeisen viikon keskiarvon.
          </p>
        <PlotChart
          data={this.props.signInHistory}
          avgLine = {true}
          xAxisName="Kirjautuneita"
        ></PlotChart>
        </div>
        );
      }

      if(this.props.registersCumulative){
        return (
          <div>

          
          <h2 className=" m50t bodyText">Rekisteröitymisien kertymä</h2>
          <p className="graphDescription bodyText">Kuvaajasta selviää, kuinka paljon rekisteröitymisiä on kertynyt kyseiseen päivään mennessä.</p>
        <PlotChart
          data={this.props.registersCumulative}
          xAxisName="Rekisteröitymisiä"
        ></PlotChart>
        </div>
        );
      }
    }

  }



export default RegisterSignIn;
