import React, { Component } from "react";
import ListTile from "./listTile";
import SearchBar from "./searchBar";
import "../css/list.css";

class list extends Component {
  constructor(props) {
    super(props);
    let allListTiles = [
      {
        title: "Rekisteröitymiset",
        description: "Tarkastele rekisteröitymisten määrää reaaliaikaisesti",
        image: "../images/register.png",
        path: "rekisteroitymisia"
      },
      {
        title: "Spottien lisääjät",
        description: "Keskimääräisen käyttäjän spottien lisääminen",
        image: "../images/lisaajat.png",
        path: "lisaajat",
        className: "todo"
      },
      {
        title: "Viimeiset kirjautumiset",
        description: "Tarkastele viimeisiä kirjautumisia",
        image: "../images/avain.png",
        path: "kirjautumiset"

      },
      {
        title: "Paikkojen määrä kategorioittain",
        description: "Sitä itseään",
        image: "../images/kategoria.png",
        path: "kategoriat"
      },
      {
        title: "Kaupunkien spottimäärät",
        description: "Suomen 10 isointa kaupunkia",
        image: "../images/kaupunki.png",
        path: "kaupungit",
        className: "todo"
      },
      {
        title: "Keskimääräinen spotti",
        description: "Minkälainen spottimetän keskiverto spotti on",
        image: "../images/pinni.png",
        path: "keskiarvospotti",
        className: "todo"
      },
      {
        title: "Puhelimille asennettujen sovellusen määrä",
        description: "Android sovelluksen julkaisuhetkestä lähtien.",
        image: "../images/puhelin.png",
        path: "sovellukset",
        className: "todo"
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
