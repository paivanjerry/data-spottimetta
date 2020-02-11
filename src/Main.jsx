import React, { Component } from "react";
import HomePage from "./components/homePage";
import Footer from "./components/footer";
import Categories from "./components/categories";
import RegisterSignIn from "./components/registerSignIn";
import "./App.css";
import axios from "axios";
import Logo from "./components/logo";
import plotChart from "./components/plotChart";

import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import PlotChart from "./components/plotChart";

class Main extends Component {
  constructor(props) {
    super(props);
    const listItems = [
      {
        title: "Rekisteröitymiset",
        description: "Tarkastele rekisteröitymisten määrää reaaliaikaisesti",
        image: "../images/register.png",
        path: "rekisteroitymisia",
        updated: -1
      },
      {
        title: "Spottien lisääjät",
        description: "Keskimääräisen käyttäjän spottien lisääminen",
        image: "../images/lisaajat.png",
        path: "lisaajat",
        className: "todo",
        updated: -1
      },
      {
        title: "Viimeiset kirjautumiset",
        description: "Tarkastele viimeisiä kirjautumisia",
        image: "../images/avain.png",
        path: "kirjautumiset",
        updated: -1
      },
      {
        title: "Paikkojen määrä kategorioittain",
        description: "Sitä itseään",
        image: "../images/kategoria.png",
        path: "kategoriat",
        updated: -1
      },
      {
        title: "Kaupunkien spottimäärät",
        description: "Suomen 10 isointa kaupunkia",
        image: "../images/kaupunki.png",
        path: "kaupungit",
        className: "todo",
        updated: -1
      },
      {
        title: "Keskimääräinen spotti",
        description: "Minkälainen spottimetän keskiverto spotti on",
        image: "../images/pinni.png",
        path: "keskiarvospotti",
        className: "todo",
        updated: -1
      },
      {
        title: "Puhelimille asennettujen sovellusten määrä",
        description: "Android sovelluksen julkaisuhetkestä lähtien.",
        image: "../images/puhelin.png",
        path: "sovellukset",
        updated: -1
      }
    ];
    this.state = { listItems };
  }

  componentDidMount() {
    this.getDataFromFile();

    if (this.state.allData) {
      return;
    }


    let allData;

    if (localStorage.getItem("spottidata")) {
      allData = JSON.parse(localStorage.getItem("spottidata"));
    }
    // setting allData to null if it wasn't stored in the past hour
    if (allData && new Date().getTime() > allData.date + 3600000) {
      allData = null;
    }

    // if allData still got value, it means we can use it as valid cache for this hour
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
        <Logo></Logo>
        <Router>
          <Switch>
            <Route exact path="/kategoriat">
              {this.getCategoryRoute()}
            </Route>
            <Route exact path="/sovellukset">
              <h2>Asennuksia Android-laitteilla (Käynnistetty viimeisen 30 päivän aikana)</h2>
              <PlotChart data={this.state.androidInstallations} xAxisName={"Asennuksia"}/>
            </Route>
            <Route exact path="/rekisteroitymisia">
              <RegisterSignIn
                data={this.parseDateData("creationTime")}
                situation="Rekisteröitymisiä"
              ></RegisterSignIn>
            </Route>
            <Route exact path="/kirjautumiset">
              <RegisterSignIn
                data={this.parseDateData("lastSignIn")}
                situation="Viimeisin kirjautuminen"
              ></RegisterSignIn>
            </Route>

            <Route exact path="*">
              <HomePage listItems={this.state.listItems} />
            </Route>
          </Switch>
        </Router>
        <Footer></Footer>
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
  }

  getCategoryRoute() {
    if (!this.state.allData) {
      return;
    }
    let data = this.parseCategoryData();
    return <Categories data={data}></Categories>;
  }
  parseCategoryData() {
    // Loop the data
    //    Loop the stored category data
    //        if category found in category data -> append category data counter
    //    Category not found in category data -> Initialize the category with counter of 0

    let categoryData = [];

    for (let spot in this.state.allData.data) {
      let category = this.state.allData.data[spot]["TYYPPI"];
      let found = false;
      for (let i = 0; i < categoryData.length; i++) {
        const element = categoryData[i];
        if (element["category"] != null && element["category"] === category) {
          element["amount"]++;
          found = true;
          continue;
        }
      }
      if (!found) {
        // Not found. Initialize the object
        let object = {
          category: category,
          amount: 0
        };
        categoryData.push(object);
      }
    }
    // Parsing done. Sort the data.
    categoryData.sort((a, b) => (a.amount > b.amount ? 1 : -1));
    return categoryData;
  } //parseCategoryData()

  parseDateData(situation) {
    // Loop the data
    //    Loop the stored date data
    //        if certain day found in parsed data -> append date data counter
    //    date not found in date data -> Initialize the date with counter of 0
    if (!this.state.allData) {
      return;
    }

    let parsedData = [
      /* date: "2.10.2019", amount: 5 */
    ];
    for (let i = 0; i < this.state.allData.users.length; i++) {
      let found = false;
      const creationStr = this.state.allData.users[i][situation];
      // date is in format "2.10.2019"
      const dateObj = new Date(creationStr);
      const date =
        dateObj.getDate() +
        "." +
        (dateObj.getMonth() + 1) +
        "." +
        dateObj.getFullYear();

      for (let i = 0; i < parsedData.length; i++) {
        const element = parsedData[i];

        if (element["date"] != null && element["date"] === date) {
          element["amount"]++;
          found = true;
          continue;
        }
      }
      if (!found) {
        // Not found. Initialize the object
        let object = {
          date: date,
          amount: 0
        };
        parsedData.push(object);
      }
    }
    parsedData.sort(dateCompare);

    return parsedData;
  }

  getDataFromFile() {
    const file = require("./data/androidActiveDownloads.csv");
    var rawFile = new XMLHttpRequest();
    rawFile.open("GET", file, false);
    rawFile.onreadystatechange = () => {
      if (rawFile.readyState === 4) {
        if (rawFile.status === 200 || rawFile.status === 0) {
          var allText = rawFile.responseText;

          console.log(allText.split("\n").length);
          let rows = allText.split("\n");

          let androidInstallations = [];
          for (let i = 4; i < rows.length - 2; i++) {
            const element = rows[i];
            const timeParts = element.split(",")[1].split("-");
              const listTime =
                timeParts[2] + "." + timeParts[1] + "." + timeParts[0];

            androidInstallations.push({
              date: listTime,
              amount: parseInt(element.split(",")[3].replace("-","0"))
            });

            // Last row -> take the date and show in the list
            if (i === rows.length - 3) {
              const listItems = [...this.state.listItems];
              for (let index = 0; index < listItems.length; index++) {
                const element = listItems[index];
                if (element.path === "sovellukset") {
                  listItems[index].updated = listTime;
                  this.setState({ listItems, androidInstallations });
                  continue;
                }
              }
            }
          }
        }
      }
    };
    rawFile.send(null);
  }

} // class Main

function dateCompare(a, b) {
  const aSplit = a.date.split(".");
  const bSplit = b.date.split(".");
  // Backward loop, compare year, then month, then day
  for (let i = 2; i >= 0; i--) {
    if (aSplit[i] !== bSplit[i]) {
      return parseInt(aSplit[i]) > parseInt(bSplit[i]) ? 1 : -1;
    }
  }
}

export default Main;
