import React, { Component } from "react";
import HomePage from "./components/homePage";
import Footer from "./components/footer";
import Categories from "./components/categories";
import RegisterSignIn from "./components/registerSignIn";
import "./App.css";
import axios from "axios";
import Logo from "./components/logo";

import { BrowserRouter as Router, Switch, Route } from "react-router-dom";


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
        <Logo></Logo>
        <Router>
          <Switch>
            <Route exact path="/kategoriat">
              {this.getCategoryRoute()}
            </Route>
            <Route exact path="/rekisteroitymisia">
              <RegisterSignIn data={this.parseDateData("creationTime")} situation="Rekisteröitymisiä"></RegisterSignIn>
            </Route>
            <Route exact path="/kirjautumiset">
              <RegisterSignIn data={this.parseDateData("lastSignIn")} situation="Viimeisin kirjautuminen"></RegisterSignIn>
            </Route>

            <Route exact path="*">
              <Home />
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
  Home() {
    return <HomePage></HomePage>;
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

      /*
      birthday.getFullYear();      // 1980
      birthday.getMonth();         // 6
      birthday.getDate(); 

      var date = new Date().toLocaleDateString().replace(/\//g,".");
      date.replace(/\//g,".");
      
      
      */
    }
    parsedData.sort(dateCompare);

    return parsedData;
  }
} // class Main
function Home() {
  return <HomePage></HomePage>;
}

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
