import React, { Component } from "react";
import "../css/dataTable.css";

class DataTable extends Component {
  // valsAscending: 1 yes, 0 no, -1 not sorted by vals
  
  


  constructor(props) {
    super(props);
    // tabledata = [[int määrä, Str selitys, int sija], [...], [...]]
    let tableData = [...this.props.data];
    for(let i = 0; i < tableData.length; i++){
      tableData[i].push(i + 1);
    }
    this.state = { tableData , valsAscending: -1, keysAscending: -1};
  }

  render() {
    return (
      <div>
        <table className="dataTable">
          <thead>
            <tr>
              
              {this.getHeader()}
              
              
              <th onClick={this.sortTableKey.bind(this)}>{this.props.leftTitle}</th>
              <th onClick={this.sortTableVal.bind(this)}>{this.props.rightTitle}</th>
            </tr>
          </thead>

            <tbody>

            
          {this.props.data ? this.state.tableData.map((wordElement, index) => (
            <tr key={index}>
              {this.getOrderRow(wordElement[2])}
              <td>{wordElement[0]}</td>
              <td>{wordElement[1]}</td>
            </tr>
          )): ""}
</tbody>
        </table>
      </div>
    );
  }
  getHeader(){
    if(this.props.sortable !== false){
      return(<th onClick={this.sortTableVal.bind(this)}>sija</th>);
    }
  }
  getOrderRow(index){
    if(this.props.sortable !== false){
      return(<td>{index}</td>);
    }
  }

  sortTableVal(){
    if(this.props.sortable === false){
      return;
    }
    let tableData = this.state.tableData;
    let newValsAscending = 1;
    if(this.state.valsAscending === 1 || this.state.valsAscending === -1){
      tableData.sort(function (a, b) {
        if (a[2] > b[2]) {
            return -1;
        }
        if (b[2] < a[2]) {
            return 1;
        }
        return 0;
    });
    newValsAscending = 0;
    
    }
    else if(this.state.valsAscending === 0){
      tableData.sort(function (a, b) {
        if (a[2] < b[2]) {
            return -1;
        }
        if (b[2] > a[2]) {
            return 1;
        }
        return 0;
    });
    newValsAscending = 1;
    
  }
  let newKeysAscending = -1;
  this.setState({
    tableData,
    valsAscending: newValsAscending,
    keysAscending: newKeysAscending
  });

  }
  sortTableKey(){
    if(this.props.sortable === false){
      return;
    }
    let tableData = this.state.tableData;
    let newKeysAscending = 1;
    if(this.state.keysAscending === 1 || this.state.keysAscending === -1){
      tableData.sort(function (a, b) {
        if (a[0] > b[0]) {
            return -1;
        }
        if (b[0] < a[0]) {
            return 1;
        }
        return 0;
    });
    newKeysAscending = 0;
    
    }
    else if(this.state.keysAscending === 0){
      tableData.sort(function (a, b) {
        if (a[0] < b[0]) {
            return -1;
        }
        if (b[0] > a[0]) {
            return 1;
        }
        return 0;
    });
    newKeysAscending = 1;
    
  }
  let newValsAscending = -1;
  this.setState({
    tableData,
    keysAscending: newKeysAscending,
    valsAscending: newValsAscending
  });
  }
}

export default DataTable;
