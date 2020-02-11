import React, { Component } from "react";

import CategoryChart from "./categoryChart";

class CityPage extends Component {
  render() {
    return (
      <div>
        <h2>Spottien jakautuminen kaupungeittain</h2>
        <p>
          Laskettu kaupungit ja kunnat mukaan, joiden asukasluku on yli 20 000.
          Käytetty simppeliä "piirrä 20 km halkaisijan neliö kaupungin ympärille
          ja tarkasta löytyykö spotti sieltä" -menetelmää. Tällätavoin
          vierekkäisten kaupunkien spotit saattaa mennä väärälle kaupungille.
        </p>
        <CategoryChart
          data={this.props.data}
          dataKey="city"
          xAxisName="Spotteja kaupungissa"
        ></CategoryChart>

        <h2>Asukasluku</h2>
        <p>Sama kaupunkien järjestys, asukasluku palkeissa</p>
        <CategoryChart
          data={this.props.data}
          yDataKey="population"
          dataKey="city"
          xAxisName="Asukasluku"
        ></CategoryChart>

        <h2>Kaupunkien spottitiheys</h2>
        <p>
          Kaupungit samassa järjestyksessä kuin aiemmassa kuvaajassa. Laskettu
          kaavalla 10000*spotit/asukkaat
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
