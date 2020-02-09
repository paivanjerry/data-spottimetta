import React, { Component } from "react";


class SearchBar extends Component {
    state = {  }
    render() {
        return (
            <input placeholder="Hae tilastoa" onChange={(val) =>this.props.onChange(val)} type="text"/>
        );
    } 
}

export default SearchBar;