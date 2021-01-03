import React, { Component } from "react";


class CumulativeSlider extends Component {
    state = { sliderValue: 30 }
    render() {
        return (
          <div className="m50t">
          <div className="sliderContainer">
            <h3>{this.props.title}</h3>
            <p>
              {this.props.desc}
            </p>
            <input
              id="spotRange"
              type="range"
              min="1"
              max="365"
              step="1"
              value={this.state.sliderValue}
              onChange={event => {
                this.setState({ sliderValue: parseInt(event.target.value) },() => this.calculate());
                
              }}
            ></input>
            <p className="distLabel m5r inline">Viimeiset</p>
            <input
              id="numberBox"
              type="number"
              className="value inline"
              max="365"
              min="1"
              value={this.state.sliderValue}
              onChange={event => {
                this.setState({ sliderValue: parseInt(event.target.value) },() => this.calculate());

              }}
              step="1"
            />
            <p className="inline m5l">päivää</p>
            <br />
            <p className="inline">{this.props.unit + ":"}</p>
            <p className="inline m5l">
              <b>{(this.state.calculatedSignedAmount !== undefined ? this.state.calculatedSignedAmount : "") }&nbsp;</b>{"(" + (this.state.calculatedDays || "") + "pv)"}
            </p>
          </div>
        </div>
        );
    }
    componentDidMount(){
      this.calculate();
      setTimeout(()=>{this.calculate()}, 1000)
      setTimeout(()=>{this.calculate()}, 2000)
    }
    calculate(){
      if(!this.props.data){
        return
      }
      let sum = 0;
      let allList = [...this.props.data]
      const sliderval = this.state.sliderValue
      for(let i = allList.length - 1; allList.length -1 - i < sliderval && i >= 0; i--){
        sum += allList[i].amount
      }
      this.setState({calculatedDays: sliderval, calculatedSignedAmount: sum})
    }
}

export default CumulativeSlider;