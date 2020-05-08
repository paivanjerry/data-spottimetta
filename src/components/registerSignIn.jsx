import React, { Component } from "react";
import PlotChart from "./plotChart";

class RegisterSignIn extends Component {
  render() {
    // Rekisteröitymisiä tai kirjautumisia
    return (
      <div>
        <h2 className="bodyText">{this.props.situation}</h2>
        <p className="graphDescription bodyText">{this.props.description}</p>
        <PlotChart
          dot={this.props.dot}
          data={this.props.data}
          xAxisName={this.props.situation}
        ></PlotChart>

        {this.getAnotherGraph()}
        
      </div>
    );
    
    }
    getAnotherGraph(){
      if(this.props.signInHistory){
        return (
          <div>
          <h2 className=" m50t bodyText">Kirjautumiset päivittäin</h2>
          <p className="graphDescription bodyText">Kuvaajassa näkyy kyseisen päivän aikana kirjautuneet käyttäjät. Vanhat ajankohdat ei laske käyttäjän kirjautuessa uudestaan.</p>
        <PlotChart
          dot={this.props.dot}
          data={this.props.signInHistory}
          xAxisName="Kirjautumisia"
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
          dot={this.props.dot}
          data={this.props.registersCumulative}
          xAxisName="Rekisteröitymisiä"
        ></PlotChart>
        </div>
        );
      }
    }

  }



export default RegisterSignIn;
