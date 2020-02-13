import React, { Component } from "react";

import CategoryChart from "./categoryChart";
import "../css/graphPage.css";
import "../App.css";

class CityPage extends Component {
  render() {
    return (
      <div>
        <h2 className="bodyText">Spottien jakautuminen kaupungeittain</h2>
        <p className="bodyText">
          Laskettu kaupungit ja kunnat mukaan, joiden asukasluku on yli 20 000.
          Käytetty simppeliä "piirrä 20 km halkaisijan neliö kaupungin ympärille
          ja tarkasta löytyykö spotti sieltä" -menetelmää. Eli suomeksi,
          laskelmat eivät ole tarkkoja.
        </p>
        <a href="https://datajournalismi.blogspot.com/2013/03/suomen-kuntien-koordinaattitiedot.html">
          Kuntien sijaintien lähde
        </a>
        <CategoryChart
          data={this.props.data}
          dataKey="city"
          xAxisName="Spotteja kaupungissa"
        ></CategoryChart>

        <h2 className="m-top">Asukasluku</h2>
        <p className="bodyText">
          Sama kaupunkien järjestys, asukasluku palkeissa
        </p>
        <a href="https://www.kuntaliitto.fi/tilastot-ja-julkaisut/kaupunkien-ja-kuntien-lukumaarat-ja-vaestotiedot">
          Lähde
        </a>
        <CategoryChart
          data={this.props.data}
          yDataKey="population"
          dataKey="city"
          xAxisName="Asukasluku"
        ></CategoryChart>

        <h2 className="m-top">Kaupunkien spottitiheys</h2>
        <p className="bodyText">
          Kaupungit samassa järjestyksessä kuin aiemmissa kuvaajissa. Yksikkönä
          spottia per 10 000 asukasta.
        </p>
        <CategoryChart
          data={this.getSpotPerCitizen()}
          dataKey="city"
          xAxisName="Spottitiheys"
        ></CategoryChart>
      </div>
    );
  }
  getSpotPerCitizen() {
    if (!this.props.data) {
      return;
    }
    let perCitizenList = [];
    for (let i = 0; i < this.props.data.length; i++) {
      const element = this.props.data[i];

      let ratio = (10000 * element.amount) / element.population;
      ratio = (Math.round(ratio * 100) / 100).toFixed(2);
      let tmpElement = {
        city: element.city,
        amount: ratio
      };
      perCitizenList.push(tmpElement);
    }
    return perCitizenList;
  }
}

export default CityPage;
