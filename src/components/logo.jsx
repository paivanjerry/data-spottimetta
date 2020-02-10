import React, { Component} from 'react';
import "../css/logo.css"

class Logo extends Component {
    state = {  }
    render() {
        return (
            <img className="logo" src="/spottimettadataotsikko.gif" alt="Data spottimettä" onClick={this.toHomePage}/>
        );
    }
    toHomePage(){
        window.location.pathname = "/";
    }
}
export default Logo; 