import React, { Component} from 'react';

class Counter extends Component {

  state = {
    count: 1

  };

  muutaTilaa = () =>{


    this.setState( {count: this.state.count + 1}); 
  }
  render(){


    return (
      <React.Fragment>
        <span className= {this.getBadgeClasses()}>{this.formatCount()}</span>
        <button onClick= {this.muutaTilaa} className="btn btn-secondary brn-sm">hola</button>
      </React.Fragment>);
  }

  formatCount() {
    const {count} = this.state
    return count === 0 ? 'Zero' : count;
  }
  getBadgeClasses(){
    let classes = "m-2 badge badge-";
    classes += this.state.count === 0 ? "warning" : "primary";
    return classes;
  }
}

export default Counter;
