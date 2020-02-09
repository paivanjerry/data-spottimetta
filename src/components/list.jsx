import React, { Component } from "react";
import ListTile from "../components/listTile";
import SearchBar from "../components/searchBar";
import "../css/list.css";

class list extends Component {
  constructor(props) {
    super(props);
    this.state = {
      allListTiles: [
        {
          title: "Rekisteröitymiset",
          id: "1",
          description: "Tarkastele rekisteröitymisten määrää reaaliaikaisesti",
          image: "../images/register.png"
        },
        {
          title: "Spottilisääjät",
          id: "2",
          description: "hyvä käpyrä2",
          image: "../images/puhelin.png"
        }
      ],
      listTiles: [
        {
          title: "Rekisteröitymiset",
          id: "1",
          description: "Tarkastele rekisteröitymisten määrää reaaliaikaisesti",
          image: "../images/register.png"
        },
        {
          title: "Spottilisääjät",
          id: "2",
          description: "hyvä käpyrä2",
          image: "../images/puhelin.png"
        }
      ]
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
                className="listTile"
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
    console.log(
      "Kutsuttu metodia searchHandler lista tiedostossa " + event.target.value
    );

    let listTiles = [];
    let typedText = event.target.value.toLowerCase();
    const allListTiles = [...this.state.allListTiles];
    for (let i = 0; i < allListTiles.length; i++) {
      const element = allListTiles[i];
      if (element.title.toLowerCase().includes(typedText)) {
        console.log("Matchi");
        listTiles.push(element);
      } else {
        console.log(element.title + " ei sisältäny sanaa " + typedText);
      }
    }
    this.setState({ listTiles });
  };
}

export default list;
