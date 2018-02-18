import React from 'react';
import { postBackend } from '../../utils/apiHelper';

class TestGraphs extends React.Component {
  constructor(props) {
    super(props);
    this.d3 = window.d3;
    this.chart = window.Chart;
    this.state = { data: 1 };
  }
  componentDidUpdate(prevProps, prevState) {
    {
      this.renderGraph2();
    }
  }
  componentDidMount() {
    postBackend().then(out => {
      this.setState({
        data: out.result
      });
      {
        this.renderGraph();
      }
    });
  }
  renderGraph2() {
    if (this.state.data == 1) {
      return;
    } else {
      var d = this.state.data;
      var timestamps = [];
      var byHour = [];
      var currHour = [];
      var start;
      for (var x = 0; x < d.length; x++) {
        if (typeof start == 'undefined') {
          start = d[x.timeStamp];
        }
        if (d[x].timeStamp - start < this.props.number * this.props.time) {
          currHour.push(d[x].timeStamp);
        } else {
          byHour.push(currHour.length);
          currHour = [];
          start = d[x].timeStamp;
        }
      }
      byHour.shift();
      var lengthData = byHour.length;
      var data = byHour.splice(lengthData - 10, lengthData);
    }
  }
  renderGraph() {
    if (this.state.data == 1) {
      return;
    } else {
      var d = this.state.data;
      var timestamps = [];
      var byHour = [];
      var currHour = [];
      var start;
      for (var x = 0; x < d.length; x++) {
        if (typeof start == 'undefined') {
          start = d[x.timeStamp];
        }
        if (d[x].timeStamp - start < this.props.number * this.props.time) {
          currHour.push(d[x].timeStamp);
        } else {
          byHour.push(currHour.length);
          currHour = [];
          start = d[x].timeStamp;
        }
      }
      byHour.shift();
      var lengthData = byHour.length;
      var data = byHour.splice(lengthData - 10, lengthData);
      //          var dataObject = [{
      //            labels: ["10hr","9hr","8hr","7hr","6hr","5hr","4hr","3hr","2hr","1hr",],
      //            //backgroundColor: ['#e6194b','#3cb44b','#ffe119','#0082c8','#f58231','#911eb4','#46f0f0','#f032e6','#d2f53c','#fabebe'],
      //            backgroundColor: "#e6194b",
      //            borderColor:  "#e6194b",
      //            //borderColor: ['#e6194b','#3cb44b','#ffe119','#0082c8','#f58231','#911eb4','#46f0f0','#f032e6','#d2f53c','#fabebe'],
      //            borderWidth: 1,
      //            data: [0, 10, 5, 2, 20, 30, 45],
      //            //data: data,
      //          }]
      var barChartData = {
        labels: [
          '10hr',
          '9hr',
          '8hr',
          '7hr',
          '6hr',
          '5hr',
          '4hr',
          '3hr',
          '2hr',
          '1hr'
        ],
        datasets: [
          {
            label: 'Number of Transactions',
            backgroundColor: '#e6194b',
            borderColor: '#e6194b',
            borderWidth: 1,
            data: data
          }
        ]
      };
      var ctx = document.getElementById('myChart').getContext('2d');
      var myBarChart = new this.chart(ctx, {
        type: 'bar',
        data: barChartData,
        options: {
          responsive: true,
          legend: {
            position: 'top'
          },
          title: {
            display: true,
            text: 'CryptoKitties Traffic'
          },
          scales: {
            xAxes: [
              {
                stacked: true
              }
            ],
            yAxes: [
              {
                stacked: true
              }
            ]
          }
        }
      });
    }
  }
  render() {
    return (
      <div>
        <canvas id="myChart" />
        <div className="chart" />
      </div>
    );
  }
}

export default TestGraphs;
