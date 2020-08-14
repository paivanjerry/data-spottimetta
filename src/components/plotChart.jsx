// Class for common one line chart
// Parameters: 
// data = [{date: "12.12.2012", amount: 5}][...][...]
// String xAxisName = "Asennuksia" -- hover labelin teksti
// bool dot = false  -- piirretäänkö mittauspisteisiin pisteet

import React, { Component } from "react";
import {
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  ReferenceDot,
  Brush,
  ReferenceLine
} from "recharts";

let yOffset = 50;


class PlotChart extends Component {

  render() {
    return (
      <ResponsiveContainer width="90%" height={600}>
        <LineChart
          
          data={this.props.data}
          margin={{ top: 5, right: 20, bottom: 5, left: 0 }}
        >
          <Line
            animationDuration={850}
            isFront="true"
            name={this.props.xAxisName}
            type="monotone"
            dataKey="amount"
            stroke="#0073e6"
            strokeWidth="2"
            dot={this.props.data && this.props.data.length < 30}
            activeDot={{ stroke: "green", fill: "green", strokeWidth: 2, r: 5 }}
          />
          <Brush dataKey="date" height={100} />
          {this.props.data
            ? this.props.data.map((dataElement, index) =>
                this.getRefDot(dataElement, index)
              )
            : ""}
            {this.getAvgLine()}
            {this.getWeekAvgLine()}

          <CartesianGrid stroke="#ccc" strokeDasharray="5 5" />
          <XAxis dataKey="date"  />
          <YAxis dataKey="amount" name={this.props.xAxisName + " - "} />
          <Tooltip />

        </LineChart>
      </ResponsiveContainer>
      
    );
  }


  

getAvgLine(){
  if(!this.props.avgLine){
    return;
  }
  return <ReferenceLine y={this.countWeekAvg()} stroke="green" strokeDasharray="20 20" />
  
}

getWeekAvgLine(){
  if(!this.props.avgLine){
    return;
  }
  return <ReferenceLine y={this.countAvg()} stroke="red" strokeDasharray="20 20" />
}

countWeekAvg(){
  let avgCounter = 1;
  let avgAmount = 0;
  if(this.props.data === undefined){
      return;
    }
  for(let i = this.props.data.length -1; i > this.props.data.length -8; i--){

    
    let value = this.props.data[i];
    let val = value.amount;  
    avgAmount = avgAmount + (val - avgAmount) / avgCounter;
    avgCounter++;
    
  }
  return avgAmount;
}

countAvg(){
  let avgCounter = 1;
  let avgAmount = 0;
  if(this.props.data === undefined){
      return;
    }
  for(let i = 0; i < this.props.data.length; i++){
    let value = this.props.data[i];
    let val = value.amount;
    avgAmount = avgAmount + (val - avgAmount) / avgCounter;
    avgCounter++;
  }
  return avgAmount;
}

  getRefDot(dataElement, index) {
    
    if (dataElement.info) {
      return (
        <ReferenceDot
          key={dataElement.date}
          x={dataElement.date}
          y={this.getChangeOffset()}
          fill="lightgreen"
          fillOpacity="0.5"
          label={this.props.data[index].info}
          isFront="false"
        />
      );
    }
  }
  getChangeOffset() {
    if (yOffset > 290) {
      yOffset = 50;
    } else {
      yOffset += 20;
    }
    return yOffset;
  }
}

export default PlotChart;
