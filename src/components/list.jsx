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
        <table className="listTable">
          <thead>
            <tr>
              <th className="iconHeader listImage">Kuvake</th>
              <th className="tableCenter">Nimi/Kuvaus</th>
              <th className="tableUpdated">Päivitetty</th>
            </tr>
          </thead>
          <tbody onClick={this.scrollTop.bind()}>
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
  scrollTop() {
    window.scrollTo(0, 0);
  }

  searchHandler = event => {
    let listTiles = [];
    let typedText = event.target.value.toLowerCase();
    const allListTiles = [...this.props.listItems];
    for (let i = 0; i < allListTiles.length; i++) {
      const element = allListTiles[i];
      if (element.title.toLowerCase().includes(typedText) || element.description.toLowerCase().includes(typedText)) {
        listTiles.push(element);
      }
    }
    this.setState({ listTiles });
  };
}

export default list;
