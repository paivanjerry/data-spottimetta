import React, { Component } from "react";
import ListTile from "../components/listTile";
import SearchBar from "../components/searchBar";
import "../css/list.css";

class list extends Component {
  constructor(props) {
    super(props);
    let allListTiles = [
      {
        title: "Rekisteröitymiset",
        description: "Tarkastele rekisteröitymisten määrää reaaliaikaisesti",
        image: "../images/register.png"
      },
      {
        title: "Spottien lisääjät",
        description: "Keskimääräisen käyttäjän spottien lisääminen",
        image: "../images/lisaajat.png"
      },
      {
        title: "Viimeiset kirjautumiset",
        description: "Tarkastele viimeisiä kirjautumisia",
        image: "../images/avain.png"
      },
      {
        title: "Paikkojen määrä kategorioittain",
        description: "Sitä itseään",
        image: "../images/kategoria.png"
      },
      {
        title: "Kaupunkien spottimäärät",
        description: "Suomen 10 isointa kaupunkia",
        image: "../images/kaupunki.png"
      },
      {
        title: "Keskimääräinen spotti",
        description: "Minkälainen spottimetän keskiverto spotti on",
        image: "../images/pinni.png"
      },
      {
        title: "Puhelimille asennettujen sovellusen määrä",
        description: "Android sovelluksen julkaisuhetkestä lähtien.",
        image: "../images/puhelin.png"
      }
    ];

    this.state = {
      allListTiles: allListTiles,
      listTiles: [...allListTiles]
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
    let listTiles = [];
    let typedText = event.target.value.toLowerCase();
    const allListTiles = [...this.state.allListTiles];
    for (let i = 0; i < allListTiles.length; i++) {
      const element = allListTiles[i];
      if (element.title.toLowerCase().includes(typedText)) {
        listTiles.push(element);
      }
    }
    this.setState({ listTiles });
  };
}

export default list;
