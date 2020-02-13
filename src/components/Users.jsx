import React, { Component } from "react";
import DataTable from "./dataTable";

class Users extends Component {
  state = {};
  render() {
    return (
      <div>
        <h2 className="m50t">Spottien lisääjät</h2>
        <DataTable data={this.getTableData()} leftTitle="Tilasto" rightTitle="data"/>


        <h2 className="m50t">Kaikki spottien lisääjät taulukoituna</h2>
        <DataTable data={this.props.topList} leftTitle="Nimimerkki" rightTitle="Lisättyjä spotteja"/>
      </div>
    );
  }
  getTableData(){
    let finalData = [];
    let spotSum = 0;
    let onlyOneSpot = 0;
    let multipleSpots = 0;
    
    for (let i = 0; i < this.props.topList.length; i++) {
      const element = this.props.topList[i];
      spotSum += element[1];
      if(element[1] === 1){
        onlyOneSpot++;
      }
      else{
        multipleSpots++;
      }
    }
    let avgAddAmount =  (
      Math.round(100 * spotSum/this.props.topList.length) / 100
    ).toFixed(2);


    let avgNoOldMap = (spotSum - this.props.topList[0][1])/(this.props.topList.length-1);
    avgNoOldMap = (
      Math.round(100 * avgNoOldMap) / 100
    ).toFixed(2);

    let avgNoDeveloper = (spotSum - this.props.topList[0][1]- this.props.topList[1][1])/(this.props.topList.length-2);
    avgNoDeveloper = (
      Math.round(100 * avgNoDeveloper) / 100
    ).toFixed(2);

    let multispotPropability = (
      Math.round(100 * 100 * multipleSpots/(multipleSpots + onlyOneSpot)) / 100
    ).toFixed(2);

    let addersPersentage = (
      Math.round(100 * 100 * this.props.topList.length/(this.props.topList.length + this.props.totalUsers)) / 100
    ).toFixed(2);


    finalData.push(["Spottien lisääjiä", this.props.topList.length + "/" + this.props.totalUsers + " (" + addersPersentage + "%)"]);
    finalData.push(["Spotin lisääjä lisää keskimäärin spotteja", avgAddAmount]);
    finalData.push(["Sama ilman vanhaa karttaa", avgNoOldMap]);
    finalData.push(["Sama ilman mitään sovelluksen tekijän spotteja", avgNoDeveloper]);
    finalData.push(["Todennäköisyys, että spotin lisääjä lisää usean spotin", multipleSpots + "%"]);

    return finalData;
  }
}
export default Users;
