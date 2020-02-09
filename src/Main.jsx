import React, { Component } from "react";
import HomePage from "./components/homePage";
import "./App.css";
import axios from "axios";

class Main extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
    if (this.state.allData) {
      return;
    }

    let allData;

    if (localStorage.getItem("spottidata")) {
      allData = JSON.parse(localStorage.getItem("spottidata"));
    }
    // setting allData to null if it wasn't stored today
    if (allData && new Date().getTime() > allData.date + 3600000) {
      allData = null;
    }

    // if allData still got value, it means we can use it as valid cache for today
    if (allData) {
      console.log("Käytetään jo haettua dataa.");

      this.setState({
        allData
      });
    } else {
      console.log("Ny karkas hakee uutta requestia");

      this.getData();
    }
  }

  render() {
    return (
      <div className="App">
        <HomePage></HomePage>
      </div>
    );
  }

  getData() {
    axios
      .get("https://us-central1-spottimett.cloudfunctions.net/getData")
      .then(response => this.saveData(response));
  }
  saveData(response) {
    let allData = JSON.parse(response.request.response);
    allData.date = new Date().getTime();
    localStorage.setItem("spottidata", JSON.stringify(allData));

    this.setState({ allData });
    console.log(this.state.allData);
  }
}
export default Main;
