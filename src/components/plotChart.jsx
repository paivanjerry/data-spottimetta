import React, { Component} from 'react';
import { LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';


class PlotChart extends Component {

    render() {

        
        return (
          <ResponsiveContainer width="90%" height={600}>
            <LineChart  data={this.props.data} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
            <Line name={this.props.xAxisName} type="monotone" dataKey="amount" stroke="#8884d8" />
            <CartesianGrid stroke="#ccc" strokeDasharray="5 5" />
            <XAxis dataKey="date" />
            <YAxis dataKey="amount" name={this.props.xAxisName}/>
            <Tooltip />
          </LineChart>
          </ResponsiveContainer>
            );
    }

}

export default PlotChart;