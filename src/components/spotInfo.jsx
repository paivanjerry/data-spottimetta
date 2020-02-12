import React, { Component } from "react";
import "../css/slider.css";
import CategoryChart from "./categoryChart";

class SpotInfo extends Component {
  state = {};

  componentDidMount() {
    let startValue = 50;
    let mdata = this.props.data;

    document.getElementById("spotRange").value = startValue;
    this.setState({
      sliderValue: startValue
    });
  }
  render() {
    return (
      <div>
        <h2>Spottien tilastoja</h2>

        <p>
          {this.props.spotAmount
            ? "Spottien määrä " + this.props.spotAmount
            : "Ladataan spottien määrää"}
        </p>
        <p>
          {this.props.imagesAmount
            ? "Kuvien spoteissa yhteensä: " + this.props.imagesAmount
            : "Ladataan kuvien määrää"}
        </p>
        <p>
          {this.props.commentedSpots
            ? "Kommentoituja spotteja: " + this.props.commentedSpots
            : "Ladataan kommentoitujen spottien määrää"}
        </p>
        <p>
          {this.props.commentsAmount
            ? "Kommenttien määrä " + this.props.commentsAmount
            : "Ladataan kommenttien määrää"}
        </p>

        <p>
          {this.props.noImages
            ? "Kuvattomia spotteja: " + this.props.noImages
            : "Ladataan kuvattomien spottien määrää"}
        </p>
        <p>
          {this.props.avgLat && this.props.avgLon
            ? "Spottien keskiarvosijainti on : "
            : "Ladataan spotin keskiarvosijaintia"}
          <a
            href={
              "http://www.google.com/maps/place/" +
              this.props.avgLat +
              "," +
              this.props.avgLon
            }
          >
            {this.props.avgLat && this.props.avgLon
              ? this.props.avgLat + ", " + this.props.avgLon
              : ""}
          </a>
        </p>
        <div className="sliderContainer">
          <input
            id="spotRange"
            type="range"
            min="0.01"
            max="200"
            step="0.01"
            onChange={event => {
              this.setState({ sliderValue: event.target.value });
            }}
          ></input>

          <span className="value">
            {this.state.sliderValue
              ? this.state.sliderValue + " km"
              : "MEGAMILJOONA!"}
          </span>
          <button></button>
        </div>
        <p>
          Ladataan etäisyys alle tietyn matkan ei muita spotteja prosenttii PS.
          tää sivu on kesken:)
        </p>

        <CategoryChart
          data={this.props.categoryData}
          dataKey="category"
        ></CategoryChart>
      </div>
    );
  }
}

export default SpotInfo;
