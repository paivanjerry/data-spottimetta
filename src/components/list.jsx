import React, { Component } from "react";
import ListTile from "./listTile";
import SearchBar from "./searchBar";
import "../css/list.css";
import { Link } from "react-router-dom";

class list extends Component {
  constructor(props) {
    super(props);

    this.state = {
      listTiles: [...this.props.listItems]
    };
  }
  render() {
    return (
      <div>
        {this.state.listTiles.map(tile => (
          <Link id={tile.path} to={"/" + tile.path} key={tile.path}></Link>
        ))}
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

}

export default list;
