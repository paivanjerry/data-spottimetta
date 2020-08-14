import React, { Component } from "react";
import {
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { compareDates, getDatediff } from "../helperFunctions.js";

class DualChart extends Component {
  constructor(props) {
    super(props);

    this.state = { data: [...props.data] };
  }

  render() {
    return (
      <div>
        <ResponsiveContainer data={this.state.data} width="90%" height={600}>
          <LineChart
            data={this.state.data}
            margin={{ top: 5, right: 20, bottom: 5, left: 0 }}
          >
            {this.state.data.map((s) => (
              <Line
                dataKey="amount"
                data={s.data}
                name={s.name}
                key={s.name}
                animationDuration={850}
                type="monotone"
                stroke={this.getStroke(s)}
                strokeWidth="2"
                dot={this.state.maxDate !== undefined && this.state.minDate !== undefined && getDatediff(this.state.maxDate, this.state.minDate) < 31} 
                activeDot={{
                  stroke: "green",
                  fill: "green",
                  strokeWidth: 2,
                  r: 5,
                }}
              />
            ))}
            <CartesianGrid stroke="#ccc" strokeDasharray="5 5" />
            <XAxis dataKey="date" allowDuplicatedCategory={false} />
            <YAxis dataKey="amount" />
            <Tooltip />
          </LineChart>
        </ResponsiveContainer>
        <span className="multi-range sideMargin50">
          <p>
            {this.state.minDate
              ? this.state.minDate + " - " + this.state.maxDate
              : "Koko kuvaaja"}
          </p>
          <input
            className="sidePadding50 dualRange"
            type="range"
            onInputCapture={this.scalePlot.bind(this)}
            min="1"
            max="50"
            defaultValue="50"
            id="upperSlider"
          />
          <input
            className="sidePadding50 dualRange"
            type="range"
            onInputCapture={this.scalePlot.bind(this)}
            min="1"
            max="50"
            defaultValue="1"
            id="lowerSlider"
          />
        </span>
      </div>
    );
  }
  static getDerivedStateFromProps(props, state) {
    if (state.data[0].data === undefined || state.data[1].data === undefined) {
      return {
        data: JSON.parse(JSON.stringify(props.data)),
      };
    }
    return null;
  }

  scalePlot() {
    let data = JSON.parse(JSON.stringify(this.props.data));

    let upperVal = document.getElementById("upperSlider").value;
    let lowerVal = document.getElementById("lowerSlider").value;
    if (parseInt(upperVal) < parseInt(lowerVal) || upperVal === lowerVal) {
      if (upperVal === "1") {
        document.getElementById("upperSlider").value = "2";
        upperVal = "2";
        document.getElementById("lowerSlider").value = "1";
        lowerVal = "1";
      } else {
        document.getElementById("lowerSlider").value = parseInt(upperVal) - 1;
        lowerVal = parseInt(upperVal) - 1;
      }
    }
    let startIndex = 0;

    let maxLength = this.props.data[0].data.length;
    let endIndex = maxLength;

    if (lowerVal !== "1") {
      startIndex = ((lowerVal * maxLength) / 50).toFixed(0);
    }
    if (upperVal !== "50") {
      endIndex = ((upperVal * maxLength) / 50).toFixed(0);
    }

    let androidData = data[0].data;
    let iosData = data[1].data;
    androidData = androidData.slice(startIndex, endIndex);

    let startDate = this.props.data[0].data[startIndex]
      ? this.props.data[0].data[startIndex].date
      : this.props.data[0].data[maxLength - 1].date;
    let endDate = this.props.data[0].data[endIndex - 1].date;
    if (compareDates(startDate, iosData[0].date)) {
      // beginning of iOS must be sliced
      for (let i = 0; i < iosData.length; i++) {
        if (iosData[i].date === startDate) {
          iosData = iosData.slice(i);
        }
      }
    }
    if (
      upperVal !== "50" &&
      compareDates(iosData[iosData.length - 1].date, endDate)
    ) {
      // end of iOS must be sliced
      for (let i = 0; i < iosData.length; i++) {
        if (
          iosData[i].date === endDate ||
          compareDates(iosData[i].date, endDate)
        ) {
          iosData = iosData.slice(0, i);
        }
      }
    }
    if (
      upperVal === "50" &&
      compareDates(iosData[iosData.length - 1].date, endDate)
    ) {
      endDate = iosData[iosData.length - 1].date;
    }

    data[0].data = androidData;
    data[1].data = iosData;
    this.setState({ data: data, minDate: startDate, maxDate: endDate });
  }

  getStroke(element) {
    if (element.name === "iOS") {
      return "#ff6666";
    }
    return "#0073e6";
  }
}

export default DualChart;
