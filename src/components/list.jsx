import React, { Component } from "react";
import ListTile from "./listTile";
import SearchBar from "./searchBar";
import "../css/list.css";

class list extends Component {
  componentDidMount() {
    //this.getDataFromFile();
  }

  constructor(props) {
    super(props);

    this.state = {
      
      listTiles: [...this.props.listItems]
    };
  }
  render() {
    return (
      <div>
        <SearchBar onChange={this.searchHandler}></SearchBar>
        <table className="list">
          <thead>
            <tr>
              <th>Kuvake</th>
              <th>Nimi/Kuvaus</th>
              <th>Viimeisin päivitys</th>
            </tr>
          </thead>
          <tbody>
            {this.state.listTiles.map(tile => (
              <ListTile
                className={tile.className}
                object={tile}
                key={tile.title}
              ></ListTile>
            ))}
          </tbody>
        </table>
      </div>
    );
  }

  searchHandler = event => {
    console.log(this.state.androidInstallations);
    
    let listTiles = [];
    let typedText = event.target.value.toLowerCase();
    const allListTiles = [...this.props.listItems];
    for (let i = 0; i < allListTiles.length; i++) {
      const element = allListTiles[i];
      if (element.title.toLowerCase().includes(typedText)) {
        listTiles.push(element);
      }
    }
    this.setState({ listTiles });
  };

  getDataFromFile() {
    const file = require("../data/androidActiveDownloads.csv");
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
              const listTiles = [...this.state.listTiles];
              for (let index = 0; index < listTiles.length; index++) {
                const element = listTiles[index];
                if (element.path === "sovellukset") {
                  listTiles[index].updated = listTime;
                  this.setState({ listTiles, androidInstallations });
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
}

export default list;
