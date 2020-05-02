import React, { Component } from "react";
import PlotChart from "./plotChart";

class RegisterSignIn extends Component {
  render() {
    // Rekisteröitymisiä
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
    }

  }



export default RegisterSignIn;
