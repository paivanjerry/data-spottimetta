import React, { Component } from "react";
import HomePage from "./components/homePage";
import Footer from "./components/footer";
import RegisterSignIn from "./components/registerSignIn";
import SpotInfo from "./components/spotInfo";
import "./App.css";
import axios from "axios";
import Logo from "./components/logo";
import OpenData from "./components/openData";
import Users from "./components/Users";
import CityPage from "./components/cityPage";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

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
        description:
          "Käyttäjien toimintoihin liittyviä tilastoja. Esim spotteja lisänneet käyttäjät ja niiden jakauma.",
        image: "../images/lisaajat.png",
        path: "lisaajat",
        className: "todo",
        updated: -1
      },
      {
        title: "Viimeiset kirjautumiset",
        description: "Tarkastele sovellukseen kirjautumisia",
        image: "../images/avain.png",
        path: "kirjautumiset",
        updated: -1
      },

      {
        title: "Kaupunkien spottimäärät",
        description:
          "Noin 50 suurimman kaupungin/kunnan tilastot. Taulukoita spottimäärästä, sekä asukaslukuun suhteutettua tilastoa.",
        image: "../images/kaupunki.png",
        path: "kaupungit",
        updated: -1
      },
      {
        title: "Spottien tilastot",
        description:
          "Paljon tilastoja sovelluksen paikoista, kuten kategoriajako, yleisin sana nimessä, keskiarvo spotin otsikon pituudesta yms...",
        image: "../images/pinni.png",
        path: "spotit",
        updated: -1
      },
      {
        title: "Puhelimille asennettujen sovellusten määrä",
        description: "Dataa Android sovelluksen julkaisuhetkestä lähtien.",
        image: "../images/puhelin.png",
        path: "sovellukset",
        updated: -1
      },
      {
        title: "Avoin data",
        description: "Tallenna spottimetän paikat .csv- tai .json-tiedostossa.",
        image: "../images/avoindata.png",
        path: "avoindata",
        updated: -1
      }
    ];
    this.state = { listItems };
  }

  componentDidMount() {
    this.getDataFromFile();
    this.getGeoDataFromFile();

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
      console.log("No need to fetch new data");

      this.setState({
        allData
      });
    } else {
      console.log("Goin' to get the fresh data");

      this.getData();
    }
  }

  render() {
    return (
      <div className="App">
        <Router onUpdate={() => window.scrollTo(0, 0)}>
          <Logo></Logo>
          <Switch>
            <Route exact path="/sovellukset">
              <RegisterSignIn
                data={this.state.androidInstallations}
                situation="Aktiivisia asennuksia Android-laitteilla"
                description="Laitteille asennetut viimeisen kuukauden sisällä avatut android-sovellukset. Data on kerätty koko Android-sovelluksen elinkaaren ajalta ja sitä päivitetään sivuille manuaalisesti."
                xAxisName="Asennuksia"
              />
            </Route>

            <Route exact path="/rekisteroitymisia">
              <RegisterSignIn
                data={this.parseDateData("creationTime")}
                situation="Rekisteröitymisiä"
                description="Rekisteröityneitä käyttäjiä (ensimmäinen kirjautuminen). Laskelmiin sisältyy kaikki alustat."
              />
            </Route>

            <Route exact path="/spotit">
              {this.getSpotRoute()}
            </Route>

            <Route exact path="/kirjautumiset">
              <RegisterSignIn
                data={this.parseDateData("lastSignIn")}
                situation="Viimeisin kirjautuminen"
                description="Käyttäjien viimeisimmän kirjautumisen ajanhetki. Kaikkien alustojen yhteenlaskettu tilasto."
              ></RegisterSignIn>
            </Route>

            <Route exact path="/kaupungit">
              <CityPage data={this.parseCityData()}></CityPage>
            </Route>

            <Route exact path="/avoindata">
              <OpenData data={this.state.allData}></OpenData>
            </Route>

            <Route exact path="/lisaajat">
              <Users />
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

  getSpotRoute() {
    if (!this.state.allData) {
      return;
    }
    let parsedData = this.parseSpotData();

    return (
      <SpotInfo
        categoryData={parsedData.data}
        spotAmount={Object.keys(this.state.allData.data).length}
        imagesAmount={parsedData.imagesAmount}
        commentedSpots={parsedData.commentedSpots}
        noImages={parsedData.noImages}
        commentsAmount={parsedData.commentsAmount}
        avgLat={parsedData.avgLat}
        avgLon={parsedData.avgLon}
        data={this.state.allData.data}
      ></SpotInfo>
    );
  }
  parseSpotData() {
    // Loop the data
    //    Loop the stored category data
    //        if category found in category data -> append category data counter
    //    Category not found in category data -> Initialize the category with counter of 0

    let categoryData = [];
    let imagesAmount = 0;
    let commentedSpots = 0;
    let noImages = 0;
    let commentsAmount = 0;
    let avgLat = 0;
    let avgLon = 0;

    let avgCounter = 1;
    for (let spot in this.state.allData.data) {
      let category = this.state.allData.data[spot]["TYYPPI"];
      let found = false;

      // Count the images
      let images = this.state.allData.data[spot]["KUVAT"];
      if (images !== null && images !== undefined && images !== "") {
        imagesAmount += images.split(" ").length;
      } else {
        noImages++;
      }
      let lat = parseFloat(this.state.allData.data[spot]["LAT"]);
      let lon = parseFloat(this.state.allData.data[spot]["LON"]);
      // Update the average coordinates
      avgLat = avgLat + (lat - avgLat) / avgCounter;
      avgLon = avgLon + (lon - avgLon) / avgCounter;

      avgCounter++;

      // Count the comments
      let comments = this.state.allData.data[spot]["KOMMENTIT"];
      if (comments !== null && comments !== undefined && comments !== "") {
        commentedSpots++;
        commentsAmount += comments.split("\n\n").length;
      }

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
    return {
      data: categoryData,
      imagesAmount: imagesAmount,
      commentedSpots: commentedSpots,
      noImages: noImages,
      commentsAmount: commentsAmount,
      avgLat: avgLat,
      avgLon: avgLon
    };
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

          let rows = allText.split("\n");

          let androidInstallations = [];
          for (let i = 4; i < rows.length - 2; i++) {
            const element = rows[i];
            const timeParts = element.split(",")[1].split("-");
            const listTime =
              timeParts[2] + "." + timeParts[1] + "." + timeParts[0];
            let amount = parseInt(element.split(",")[3].replace("-", "0"));

            if (amount !== 0 || i < rows.length - 10) {
              androidInstallations.push({
                date: listTime,
                amount: parseInt(element.split(",")[3].replace("-", "0"))
              });
            }

            // Last row -> take the date and show in the list
            if (
              rows[i + 1] === undefined ||
              rows[i + 2].split(",")[3] === "-"
            ) {
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

  getGeoDataFromFile() {
    const file = require("./data/parsedgeojson.json");
    this.setState({ geoData: file });
  }

  parseCityData() {
    if (!this.state.allData || !this.state.geoData) {
      return;
    }

    let topList = [];
    for (let spot in this.state.allData.data) {
      let found = false;
      const spotElement = this.state.allData.data[spot];
      const lat = spotElement.LAT;
      const lon = spotElement.LON;
      for (let i = 0; i < this.state.geoData.length; i++) {
        const element = this.state.geoData[i];

        if (
          // Spot found in some city
          element.LAT - lat < 0.16 &&
          element.LAT - lat > -0.16 &&
          element.LON - lon < 0.16 &&
          element.LON - lon > -0.16
        ) {
          for (let index = 0; index < topList.length; index++) {
            const topListElement = topList[index];
            if (topListElement.city === element.kaupunki) {
              topListElement.amount++;
              found = true;
              continue;
            }
          }
          if (!found) {
            // Not found. Initialize the object
            let object = {
              city: element.kaupunki,
              amount: 0,
              population: element.asukasLuku
            };
            topList.push(object);
          }

          break;
        }
      }
    }
    topList.sort((a, b) => (a.amount < b.amount ? 1 : -1));

    return topList;
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
