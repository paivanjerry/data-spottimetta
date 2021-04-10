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
import AppPage from "./components/appPage";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { compareDates, formatTime} from './helperFunctions.js'
import phoneImg from './images/puhelin.png'
import registerImg from './images/register.png'
import keyImg from './images/avain.png'
import addersImg from './images/lisaajat.png'
import pinImg from './images/pinni.png'
import cityImg from './images/kaupunki.png'
import opendataImg from './images/avoindata.png'
import iossessions from './files/iossessions.csv';
import appunits from './files/appunits.csv';
import androidActiveDownloads from './files/androidActiveDownloads.csv';
import androidNewDownloads from './files/androidNewDownloadsOld.csv';

// import  './fonts/lilita-one.css';
import "@fontsource/lilita-one"

class Main extends Component {
  constructor(props) {
    super(props);

    const listItems = [
      {
        title: "Puhelimille asennettujen sovellusten tilastoja",
        description:
          "Dataa Android sovelluksen julkaisuhetkestä lähtien. Versioiden julkaisuajat, aktiiviset asennukset & uudet lataukset. Tietoa myös iOS-sovelluksesta.",
        image: phoneImg,
        path: "sovellukset",
        updated: -1,
      },
      {
        title: "Rekisteröitymiset",
        description: "Tarkastele rekisteröitymisten määrää sekä kertymää reaaliaikaisesti",
        image: registerImg,
        path: "rekisteroitymisia",
        updated: -1,
      },
      {
        title: "Kirjautumiset",
        description: "Tarkastele sovellukseen kirjautumisia. Kuvaajina käyttäjien viimeinen kirjautumisen hetki sekä päivien kirjautumisten määrä",
        image: keyImg,
        path: "kirjautumiset",
        updated: -1,
      },
      {
        title: "Käyttäjiin liittyviä tilastoja",
        description:
          "Käyttäjien toimintoihin liittyviä tilastoja. Esimerkiksi spotteja lisänneet käyttäjät ja niiden jakauma.",
        image: addersImg,
        path: "lisaajat",
        updated: -1,
      },

      {
        title: "Spottien tilastot",
        description:
          "Paljon tilastoja sovelluksen paikoista, kuten kategoriajako, kommentoitujen spottien määrä, yleisin sana nimessä, keskiarvo spotin otsikon pituudesta yms...",
        image: pinImg,
        path: "spotit",
        updated: -1,
      },
      {
        title: "Kaupunkien spottimäärät",
        description:
          "Noin 50 suurimman kaupungin/kunnan tilastot. Taulukoita spottimäärästä, sekä asukaslukuun suhteutettua tilastoa.",
        image: cityImg,
        path: "kaupungit",
        updated: -1,
      },

      {
        title: "Avoin data",
        description: "Tallenna spottimetän paikat .csv- tai .json-tiedostossa.",
        image: opendataImg,
        path: "avoindata",
        updated: -1,
      },
    ];
    this.state = { listItems };
  }

  componentDidMount() {
    this.getDataFromFile();
    this.getGeoDataFromFile();
    // this.initWasm(); // TODO REMOVE THE FUNCTION

    if (this.state.allData) {
      return;
    }

    let allData;

    if (localStorage.getItem("spottidata")) {
      allData = JSON.parse(localStorage.getItem("spottidata"));
    }
    // setting allData to null if it wasn't stored in the past hour
    if ((allData && new Date().getTime() > allData.date + 3600000)) {
      allData = null;
    }

    // if allData still got value, it means we can use it as valid cache for this hour
    if (allData) {
      this.setState({ allData}, ()=>
        this.dataHaettu()
    );
    } else {
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
              <AppPage
                data={this.state.androidInstallations}
                data2={this.state.androidNewInstallations}
                
                appUnits={this.state.appUnits}
                iosSessions={this.state.iosSessions}
                situation="Aktiivisia asennuksia Android-laitteilla"
                xAxisName="Asennuksia"
              />
            </Route>

            <Route exact path="/rekisteroitymisia">
              <RegisterSignIn
                data= {this.state.registers}
                registersCumulative = {this.state.registersCumulative}
                register={true}
                situation="Rekisteröitymisiä"
                description="Rekisteröityneitä käyttäjiä päivittäin (ensimmäinen kirjautuminen). Laskelmiin sisältyy kaikki alustat."
              />
            </Route>

            <Route
              exact
              path="/spotit"
              render={() => this.getSpotRoute()}
            ></Route>

            <Route exact path="/kirjautumiset">
              <RegisterSignIn
                signInHistory = {this.getSignInHistory()}
                data={this.state.lastSignIns}
                situation="Viimeisin kirjautuminen"
                description="Käyttäjien viimeisimmän kirjautumisen ajanhetki. Kaikkien alustojen yhteenlaskettu tilasto. Toimintaperiaate: käyttäjä on kirjautunut viikko sitten ja kirjautuu nyt uudestaan --> viikon takainen kuvaajan piste pienentyy yhdellä arvolla ja tämänpäiväinen piste nousee yhdellä arvolla."
              ></RegisterSignIn>
            </Route>

            <Route exact path="/kaupungit">
              <CityPage data={this.parseCityData()}></CityPage>
            </Route>

            <Route exact path="/avoindata">
              <OpenData data={this.state.allData}></OpenData>
            </Route>

            <Route exact path="/lisaajat">
              {this.getUsersComponent()}
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
    console.log("Data fetch");
    axios
      .get("https://us-central1-spottimett.cloudfunctions.net/getData")
      .then((response) => {
        console.log("data fetch response",response);
        this.saveData(response.request.response);
        
      }).catch((e) => {
        console.log("error on request",e);
        // Error => no internet? => use cache
        this.saveData(localStorage.getItem("spottidata"));
      })
      
  }
  saveData(response) {
    if(!response){
      alert("Tietoja ei voitu hakea palvelimelta tai välimuistista.\n\nVain sovellukset sivun tiedot ovat näkyvissä.")
    }
    let allData = JSON.parse(response);
    allData.date = new Date().getTime();
    localStorage.setItem("spottidata", JSON.stringify(allData));

    this.setState({ allData}, ()=>
        this.dataHaettu()
    );
  }

  getUsersComponent() {
    if (!this.state.allData) {
      return;
    }
    let idCoord = {};
    let topList = {};
    let idList = [];
    let overHundred = 0;
    let recentAddersList = [];
    for (let spot in this.state.allData.data) {
      const id = this.state.allData.data[spot]["ID"];
      const lat = parseFloat(this.state.allData.data[spot]["LAT"]);
      const lon = parseFloat(this.state.allData.data[spot]["LON"]);

      let threeWeeksAgo = new Date().getTime() - 1814400000;
      if(this.state.allData.data[spot].AIKA && this.state.allData.data[spot].AIKA > (threeWeeksAgo/1000)){
        if(!recentAddersList.includes(id)){
          recentAddersList.push(id);
        }
      }
      if (id !== null && id !== undefined) {
        // Not from old skatemap
        idList.push(id);
        if (idCoord[id] === undefined) {
          idCoord[id] = [[lat, lon]];
        } else {
          let coordList = idCoord[id];
          coordList.push([lat, lon]);
          idCoord[id] = coordList;
        }
      } else {
        // Spot from old skatemap - no creator's ID
        idList.push(" ");
      }
    } // Looped list of id's

    let breakOut = false;
    // Count over 100km adders
    for (const id in idCoord) {
      breakOut = false;
      const userSpots = idCoord[id];
      if (userSpots.length < 2) {
        continue;
      }
      for (let i = 0; i < userSpots.length; i++) {
        for (let i2 = i + 1; i2 < userSpots.length; i2++) {
          const distance = countDistance(
            userSpots[i][0],
            userSpots[i2][0],
            userSpots[i][1],
            userSpots[i2][1]
          );
          if (distance > 100) {
            overHundred += 1;
            breakOut = true;
            break;
          }
        } // Most inner for loop ends
        if (breakOut) {
          break;
        }
      }
    }

    // Create toplist from idlist
    for (let i = 0; i < idList.length; i++) {
      let id = idList[i];

      if (topList[id] !== null && topList[idList[i]] !== undefined) {
        let amount = topList[id];
        amount += 1;
        topList[id] = amount;
      } else {
        topList[id] = 1;
      }
    }

    let orderedTopList = this.sortProperties(topList);
    for (let i = 0; i < orderedTopList.length; i++) {
      const topListElement = orderedTopList[i];
      topListElement[0] = this.state.allData.nimimerkit[topListElement[0]]
        ? this.state.allData.nimimerkit[topListElement[0]]
        : "-";
    }

    return (
      <Users
        topList={orderedTopList}
        totalUsers={this.state.allData.users.length}
        overHundred={overHundred}
        recentAdders={recentAddersList.length}
        emailList={this.state.allData.spostiLista}

      />
    );
  }

  sortProperties(obj) {
    let sortable = [];
    for (let key in obj) {
      if (obj.hasOwnProperty(key)) {
        sortable.push([key, obj[key]]);
      }
      sortable.sort(function (a, b) {
        return b[1] - a[1];
      });
    }
    return sortable; // array in format [ [ key1, val1 ], [ key2, val2 ], ... ]
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
        wordCounter={parsedData.wordCounter}
        multicomments={parsedData.multicomments}
        unchecked={parsedData.unchecked}
        iosUnchecked={parsedData.iosUnchecked}
        webUnchecked={parsedData.webUnchecked}
        androidUnchecked={parsedData.androidUnchecked}
        issues={this.state.allData.issueita}
        newSpots={parsedData.newSpots}
      ></SpotInfo>
    );
  }

  parseSpotData() {
    // Loop the data
    //    Loop the stored category data
    //        if category found in category data -> append category data counter
    //    Category not found in category data -> Initialize the category with counter of 0

    const MARKERCOLORS = {
      "-vesi-": "#188fd8",
      "-vaneri-": "#e0870f",
      "-spotti-": "#10d982",
      "-parkki-": "#ebf000",
      "-diy-": "#de09d4",
      "-talvi-": "#FFFFFF",
    };

    let categoryData = [];
    let imagesAmount = 0;
    let commentedSpots = 0;
    let multicomments = 0;
    let noImages = 0;
    let commentsAmount = 0;
    let avgLat = 0;
    let avgLon = 0;
    let wordCounter = [];
    let newSpots = 0;
    let unchecked = 0;
    let webUnchecked = 0;
    let iosUnchecked = 0;
    let androidUnchecked = 0;

    let avgCounter = 1;
    let threeWeeksAgo = new Date().getTime() - 1814400000;
    for (let spot in this.state.allData.data) {
      if(this.state.allData.data[spot].AIKA && this.state.allData.data[spot].AIKA > (threeWeeksAgo/1000)){
        newSpots++;
      }
      let category = this.state.allData.data[spot]["TYYPPI"];
      let found = false;
      let notChecked = this.state.allData.data[spot]["TARKISTETTU"];
      if (notChecked) {
        unchecked++;
        if (notChecked === "webbi") {
          webUnchecked++;
        }
        if (notChecked === "android") {
          androidUnchecked++;
        }
        if (notChecked === "ios") {
          iosUnchecked++;
        }
      }

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
        let spotsCommentsAmount = comments.split("\n\n").length;
        commentedSpots++;
        commentsAmount += spotsCommentsAmount;
        if (spotsCommentsAmount > 1) {
          multicomments++;
        }
      }

      // Count the words
      let wordInTitle = spot.split(" ");
      for (let index = 0; index < wordInTitle.length; index++) {
        const word = wordInTitle[index];
        let wordAlready = false;
        for (
          let counterIndex = 0;
          counterIndex < wordCounter.length;
          counterIndex++
        ) {
          const element = wordCounter[counterIndex];

          if (element[0].toLowerCase() === word.toLowerCase()) {
            if (word.length < 2) {
              continue;
            }
            element[1]++;
            wordAlready = true;
            continue;
          }
        }
        if (!wordAlready) {
          wordCounter.push([
            word.substr(0, 1).toUpperCase() + word.substr(1).toLowerCase(),
            1,
          ]);
        }
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
          amount: 0,
          color: MARKERCOLORS[category],
        };
        categoryData.push(object);
      }
    }

    // Parsing done. Sort the data.
    categoryData.sort((a, b) => (a.amount > b.amount ? 1 : -1));
    wordCounter.sort((a, b) => (a[1] < b[1] ? 1 : -1));

    return {
      data: categoryData,
      imagesAmount: imagesAmount,
      commentedSpots: commentedSpots,
      noImages: noImages,
      commentsAmount: commentsAmount,
      avgLat: avgLat,
      avgLon: avgLon,
      wordCounter: wordCounter.slice(0, 100),
      multicomments: multicomments,
      unchecked,
      iosUnchecked,
      webUnchecked,
      androidUnchecked,
      newSpots
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
    let earliestDate = new Date();
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
      if (dateObj < earliestDate) {
        earliestDate = dateObj;
      }

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
          amount: 1,
        };
        parsedData.push(object);
      }
    }

    // Now the datastructure contains only the dates which has user actions
    // Loop dates from the beginning and add empty ones
    const now = new Date();
    // eslint-disable-next-line
    for (let d = earliestDate; d <= now; d.setDate(d.getDate() + 1)) {
      let dateAlready = false;
      const dateStr =
        d.getDate() + "." + (d.getMonth() + 1) + "." + d.getFullYear();
      for (let i = 0; i < parsedData.length; i++) {
        const element = parsedData[i];
        if (element.date === dateStr) {
          dateAlready = true;
          break;
        }
      }
      if (!dateAlready) {
        let object = {
          date: dateStr,
          amount: 0,
        };
        parsedData.push(object);
      }
    }
    // Sort it for the graph
    parsedData.sort(dateCompare);
    
    
    if(situation === "creationTime"){
      this.setState({registers: parsedData});
    }
    else{
      this.setState({lastSignIns: parsedData});
    }
    return parsedData;
  }
  /**
   * returns datestring in format 01.09.2019
   * @param {Finnish local string representation of time. 
   * Play Store report format "1. elok. 2019"} strTime 
   */
  getDateFromStrTime(strTime){
    const monthsToNumbers = {tammik: "01", helmik: "02", maalisk: "03", huhtik: "04", toukok: "05", kesäk: "06", heinäk: "07", elok: "08", syysk: "09", lokak: "10", marrask: "11", jouluk: "12"}
    for (const key of Object.keys(monthsToNumbers)) {
      strTime = strTime.replace(key, monthsToNumbers[key])
    }
    strTime = strTime.replaceAll(".", "")
    const splitted = strTime.split(" ")
    return splitted[0] + "." + splitted[1] + "." + splitted[2]
    
  }

  getDataFromFile() {
    fetch(androidActiveDownloads)
      .then((r) => r.text())
      .then((allText) => {
        let rows = allText.split("\n");

        let androidInstallations = [];
        for (let i = 1; i < rows.length /*- 2*/; i++) {

          const element = rows[i];
          const rowInList = element.split(",");
          if(rowInList.length < 3){
            continue
          }
          
          const listTime = this.getDateFromStrTime(rowInList[0])

          
            
          let amount = parseInt(rowInList[1].replace("-", "0").replace(/\s/g,''));
          let versionInfo;
          if (true) {
            let description = rowInList[2];
            if (description.includes("Julkaisun käyttöönotto: ")) {
              const startIndex = description.search(": ") + 2;

              description = description.substr(startIndex);
              const endIndex = description.search(" ");
              versionInfo = description.substr(0, endIndex);
            }
          }

          if (amount !== 0 || i < rows.length - 10) {
            androidInstallations.push({
              date: listTime,
              amount,
              info: versionInfo,
            });
          }

          // Last row -> take the date and show in the list
          if (rows[i + 3] === undefined) {
            this.setLatestAppsUpdated(listTime);
          }
        }
        this.setState({ androidInstallations});
        this.getNewAndroidInstallsFromFile();
        this.getIosFileData(appunits, "appUnits");
        this.getIosFileData(iossessions, "iosSessions", true);
      });
  }
  setLatestAppsUpdated(listTime){
    const listItems = [...this.state.listItems];
    for (let index = 0; index < listItems.length; index++) {
      const element = listItems[index];
      if (element.path === "sovellukset") {
        listItems[index].updated = listTime;
        this.setState({ listItems});
        continue;
      }
    }
  }

  getNewAndroidInstallsFromFile() {
    fetch(androidNewDownloads)
      .then((r) => r.text())
      .then((allText) => {
        let rows = allText.split("\n");

        let androidInstallations = [];
        for (let i = 4; i < rows.length - 2; i++) {
          const element = rows[i];
          const rowInList = element.split(",");
          const timeParts = rowInList[1].split("-");
          const listTime =
            timeParts[2] + "." + timeParts[1] + "." + timeParts[0];
          let amount = parseInt(rowInList[3].replace("-", "10000000"));
          
          // Somehow this amount !== 0 statements prevent from stopping the drawing while facing 0 value
          if (amount !== 0 || i < rows.length - 10) {
            androidInstallations.push({
              date: listTime,
              amount: parseInt(rowInList[3].replace("-", "0")),
            });
          }

          // Last row
          if (rows[i + 3] === undefined) {
            this.setState({ androidNewInstallations: androidInstallations });
            const listItems = [...this.state.listItems];
            for (let index = 0; index < listItems.length; index++) {
              const element = listItems[index];
              if (element.path === "sovellukset") {
                if(compareDates(listTime, listItems[index].updated)){
                  listItems[index].updated = listTime;
                }
                
                this.setState({ listItems});
                continue;
              }
            }

            continue;
          }
        }
      });
  }

  getIosFileData(filename, statename, divide = false) {
    fetch(filename)
      .then((r) => r.text())
      .then((allText) => {
        let rows = allText.split("\n");

        let data = [];
        for (let i = 5; i < rows.length; i++) {
          const element = rows[i];

          const rowInList = element.split(",");
          const timeParts = rowInList[0].split("/");
          let day = timeParts[1];
          if (day.length === 1) {
            day = "0" + day;
          }
          let month = timeParts[0];
          if (month.length === 1) {
            month = "0" + month;
          }
          let year = "20" + timeParts[2];

          const listTime = day + "." + month + "." + year;
          let amount;
           if(divide){
             if(parseInt(rowInList[1]) === 0){
               amount = "0";
             }
             else{
               amount = (parseInt(rowInList[1])/parseInt(rowInList[2])).toFixed(2);
             }
             
            } 
           else{
             amount = parseInt(rowInList[1]);
           }
          data.push({
            date: listTime,
            amount: amount,
          });
          if(i === rows.length -1){
            const listItems = [...this.state.listItems];
            for (let index = 0; index < listItems.length; index++) {
              const element = listItems[index];
              if (element.path === "sovellukset") {
                if(compareDates(listTime, listItems[index].updated)){
                  listItems[index].updated = listTime;
                }
                
                this.setState({ listItems});
                continue;
              }
            }
          }
        }
        this.setState({ [statename]: data });
      });
  }

  getGeoDataFromFile() {
    const file = require("./data/parsedgeojson.json");
    this.setState({ geoData: file });
  }
  getSignInHistory(){
    if (!this.state.allData) {
      return;
    }
    // MaxAmount is here for setting the y-axis height.
    // Auto height has some bugs...
    let maxAmount = 0;

    let dataVector = [];
    let daysInList = this.state.allData.kirjautumishistoria.split(";");
    for(let i = 0; i < daysInList.length; i++){
      let itemSplitted = daysInList[i].split(",");
      let map = {};
      if (itemSplitted[1] > maxAmount) {
        maxAmount = itemSplitted[1];
      }
      map.date = itemSplitted[0];
      map.amount = parseInt(itemSplitted[1]);
      dataVector.push(map);
    }
    return dataVector;
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
              population: element.asukasLuku,
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
  updateListTileDates(){
    console.log("update dates");
    let listItems = [...this.state.listItems]
    let newListItems = []
    let updated = {...this.state.allData}.date
    let ago = formatTime(updated)
    for(let item of listItems){
      if(item.path !== "sovellukset"){
        
      item.updated = ago;
      }
      newListItems.push(item)
    }
    this.setState(newListItems)
  }
  async dataHaettu(){
    this.updateListTileDates();
    let registerData = this.parseDateData("creationTime");
    this.parseDateData("lastSignIn")
    this.setCumulativeRegisters(registerData);
  }

  setCumulativeRegisters(registerData){
    let cumRegData = JSON.parse(JSON.stringify(registerData));
    let total = 0;
    for(let i = 0; i < cumRegData.length; i++){
      total += cumRegData[i]["amount"];
      cumRegData[i]["amount"] = total;
    }
    this.setState({registersCumulative: cumRegData});
    
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

function countDistance(lat1, lat2, lon1, lon2) {
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



export default Main;
