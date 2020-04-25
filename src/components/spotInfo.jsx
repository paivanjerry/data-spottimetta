import React, { Component } from "react";
import "../css/slider.css";
import "../App.css";
import DataTable from "./dataTable";
import CategoryChart from "./categoryChart";

class SpotInfo extends Component {
  constructor(props) {
    super(props);
    this.state = { distancedSpots: "Ei laskettu" };
  }

  componentDidMount() {
    let startValue = 50;

    document.getElementById("spotRange").value = startValue;
    this.setState({
      sliderValue: startValue
    });
    this.initCoordList();
  }
  render() {
    return (
      <div>
        <h2 className="m20b">Spottien tilastoja</h2>
        <DataTable
          data={this.formatSpotStatistics()}
          leftTitle="Tilasto"
          rightTitle="Määrä"
          sortable={false}
        ></DataTable>

        <div className="sliderContainer">
          <h5>Hae erakoituneita spotteja</h5>
          <p>
            Etsi spotteja, joilla ei ole toista spottia valitulla etäisyytellä.
            <br />
            HOX! Pienillä etäisyyksillä vaatii paljon laskentatehoa ja tiedon
            päivitys voi ottaa hetken aikaa.
          </p>
          <input
            id="spotRange"
            type="range"
            min="0.01"
            max="99.99"
            step="0.01"
            onChange={event => {
              this.setState({ sliderValue: event.target.value });
              document.getElementById("numberBox").value = event.target.value;
            }}
          ></input>
          <p className="distLabel m5r inline">Etäisyys:</p>
          <input
            id="numberBox"
            type="number"
            defaultValue="50"
            className="value inline"
            max="99.99"
            min="0.01"
            step="0.01"
            onChange={this.handleNumberChange.bind(this)}
          />
          <p className="inline m5l">km</p>
          <br />
          <button
            className="button"
            onClick={this.countDistancedSpotsList.bind(this)}
          >
            Laske
          </button>
          <br />
          <p className="inline">Tuloksia:</p>
          <p className="inline m5l">
            <b>{this.state.distancedSpots}</b>
          </p>
          <p className="inline">{"/" + this.props.spotAmount}</p>
          <p className="inline">{this.getDistancedPersentageText()}</p>
        </div>

        <h2 className="m20b m50t">Spottien jakautuminen kategorioittain</h2>
        <CategoryChart
          data={this.props.categoryData}
          dataKey="category"
        ></CategoryChart>

        <h2 className="m50t">Spotin otsikoissa käytettyjen sanojen määrä</h2>
        <p>(käytetyimmät 100 sanaa)</p>
        <DataTable
          data={this.props.wordCounter}
          leftTitle="Sana"
          rightTitle="Määrä"
        ></DataTable>
      </div>
    );
  }
  formatSpotStatistics() {
    let finalList = [];
    finalList.push(["Spottien määrä", this.props.spotAmount]);

    let uncheckedPersentage = (
      Math.round((100 * 100 * this.props.unchecked) / this.props.spotAmount) /
      100
    ).toFixed(2);
    finalList.push(["Tarkastamattomia spotteja", this.props.unchecked + " (" + uncheckedPersentage + " %), joista lisätty sovelluksessa web: " + this.props.webUnchecked + ", Android: "+ this.props.androidUnchecked + " & iOS: " + this.props.iosUnchecked]);
    finalList.push(["Kuvia spoteissa yhteensä", this.props.imagesAmount]);

    let imagelessPersentage = (
      Math.round((100 * 100 * this.props.noImages) / this.props.spotAmount) /
      100
    ).toFixed(2);
    finalList.push([
      "Kuvattomia spotteja",
      this.props.noImages + " (" + imagelessPersentage + " %)"
    ]);

    let commentlessPersentage = (
      Math.round(
        (100 * 100 * this.props.commentedSpots) / this.props.spotAmount
      ) / 100
    ).toFixed(2);
    finalList.push([
      "Kommentoituja spotteja",
      this.props.commentedSpots + " (" + commentlessPersentage + " %)"
    ]);

    let multicommentPersentage = (
      Math.round(
        (100 * 100 * this.props.multicomments) / this.props.spotAmount
      ) / 100
    ).toFixed(2);
    finalList.push([
      "Usean kommentin spotteja",
      this.props.multicomments + " (" + multicommentPersentage + " %)"
    ]);
    finalList.push(["Kommenttien määrä", this.props.commentsAmount]);

    let prettierAvgLat = (
      Math.round(10000 * this.props.avgLat) / 10000
    ).toFixed(4);
    let prettierAvgLon = (
      Math.round(10000 * this.props.avgLon) / 10000
    ).toFixed(4);
    let coordListElement = (
      <a
        href={
          "http://www.google.com/maps/place/" +
          this.props.avgLat +
          "," +
          this.props.avgLon
        }
      >
        {prettierAvgLat + ", " + prettierAvgLon}
      </a>
    );

    finalList.push(["Spottien keskiarvosijainti", coordListElement]);

    return finalList;
  }

  getDistancedPersentageText() {
    if (isNaN(this.state.distancedSpots)) {
      return "";
    } else {
      return (
        "--> " +
        (
          Math.round(
            (100 * 100 * this.state.distancedSpots) / this.props.spotAmount
          ) / 100
        ).toFixed(2) +
        " %"
      );
    }
  }

  countDistance(lat1, lat2, lon1, lon2) {
    let phi1 = (lat1 * Math.PI) / 180;
    let phi2 = (lat2 * Math.PI) / 180;
    let lam1 = (lon1 * Math.PI) / 180;
    let lam2 = (lon2 * Math.PI) / 180;
    return (
      6371.01 *
      Math.acos(
        Math.sin(phi1) * Math.sin(phi2) +
          Math.cos(phi1) * Math.cos(phi2) * Math.cos(lam2 - lam1)
      )
    );
  }

  initCoordList() {
    let allCoords = [];
    for (let spot1 in this.props.data) {
      let lat1 = parseFloat(this.props.data[spot1]["LAT"]);
      let lon1 = parseFloat(this.props.data[spot1]["LON"]);
      allCoords.push([lat1, lon1]);
    }

    this.setState({ coordList: allCoords });
  }
  countDistancedSpotsList() {
    this.setState({ distancedSpots: "Lasketaan" });

    let count = 0;

    for (let i = 0; i < this.state.coordList.length; i++) {
      const element1 = this.state.coordList[i];

      for (let index = 0; index < this.state.coordList.length; index++) {
        const element2 = this.state.coordList[index];
        if (i === index) {
          continue;
        }
        if (
          this.countDistance(
            element1[0],
            element2[0],
            element1[1],
            element2[1]
          ) < this.state.sliderValue
        ) {
          count++;

          break;
        }
      }
    }
    this.setState({ distancedSpots: this.props.spotAmount - count });
  }
  handleNumberChange(event) {
    let value = event.target.value;

    if (value < 0) {
      document.getElementById("numberBox").value = 0.01;
      value = 0;
    } else if (value > 200) {
      value = 200;
      document.getElementById("numberBox").value = 200;
    }
    this.setState({ sliderValue: value });
    document.getElementById("spotRange").value = value;
  }
} // Class

export default SpotInfo;
