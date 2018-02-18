import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import DropDownMenu from 'material-ui/DropDownMenu';
import MenuItem from 'material-ui/MenuItem';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import logo from './logo.svg';
import './App.css';

const App = () => (
  <MuiThemeProvider>
      <Router>
         <div className="demo-layout-transparent mdl-layout mdl-js-layout header">
          <header className="mdl-layout__header mdl-layout__header--transparent">
            <div className="mdl-layout__header-row">
              <span className="mdl-layout-title header">CryptoKitties Block Explorer</span>
              <div className="mdl-layout-spacer"></div>
            </div>
          </header>
          <div className="mdl-layout__drawer">
            <span className="mdl-layout-title menu">Menu</span>
            <nav className="mdl-navigation">
              <a className="mdl-navigation__link" href="/">General Patterns</a>
              <a className="mdl-navigation__link" href="/blocks">Blocks</a>
              <a className="mdl-navigation__link" href="/account">Account Activity</a>
            </nav>
          </div>
          <main className="mdl-layout__content content">
              <Route exact path="/" component={Home} />
              <Route path="/blocks" component={Blocks} />
              <Route path="/account" component={AccountActivity} />
          </main>
         </div>
      </Router>
  </MuiThemeProvider>
);

class Home extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
          value: 1,
          hours: 60,
        };
    }
    handleChange1 = (event, index, value) => this.setState({value});
    handleChange2 = (event, index, hours) => this.setState({hours});
    render() {
        return (
          <div className="container">
            <div className="selectors">
              <DropDownMenu value={this.state.value} onChange={this.handleChange1.bind(this)} className="dropdown" style="width: 200px; font-family: Montserrat;">
                <MenuItem value={1} primaryText="1"/>
                <MenuItem value={5} primaryText="5" />
                <MenuItem value={10} primaryText="10" />
                <MenuItem value={15} primaryText="15" />
                <MenuItem value={30} primaryText="30" />
              </DropDownMenu>
              <DropDownMenu value={this.state.hours} onChange={this.handleChange2.bind(this)} className="dropdown">
                <MenuItem value={60} primaryText="Mins" />
                <MenuItem value={3600} primaryText="Hours" />
                <MenuItem value={86400} primaryText="Days" />
                <MenuItem value={604800} primaryText="Weeks" />
              </DropDownMenu>
            </div>
            <TestGraphs number={this.state.value} time={this.state.hours}/>
          </div>

        );
    }
}

const BlockEntry = ({ blockNum, timestamp, numTxns }) => (
  <tr>
    <td>{blockNum}</td>
    <td>{(new Date(timestamp*1000)).toString()}</td>
    <td>{numTxns}</td>
  </tr>
);

class Blocks extends React.Component {
  constructor(props) {
    super(props);
    this.state = { blocks: [] }
  }

  componentDidMount() {
    fetch('http://localhost:5000/blocks').then(res=>res.json()).then(out=>{
      this.setState({
        blocks: out,
      })
    });
  }

  render() {
    return (
      <div className="blocks-header">
        <h2 className="title">Blocks</h2>
        <table><tbody>
        <tr>
          <td>Block Height</td>
          <td>Timestamp</td>
          <td># Transactions</td>
        </tr>
        {this.state.blocks.map(block => <BlockEntry
          key={block.blockNum} timestamp={block.timestamp} blockNum={block.blockNum} numTxns={block.txns}
        />)}
        </tbody></table>
      </div>
    );
  }
}

class AccountActivity extends React.Component {
  constructor(props) {
      super(props);
      this.d3 = window.d3;
      this.chart = window.Chart;
      // this.state.blocks = [];
  }
  componentDidMount() {  
      function getActivity(data) {
        var accounts = {}
        var txnList = data.result;
        for (var i = 0; i < txnList.length; i++){
          if (!(txnList[i].from in accounts)) {
            accounts[txnList[i].from] = 0;
          } else {
            accounts[txnList[i].from] += 1;
          }
          if (!(txnList[i].to in accounts)){
            accounts[txnList[i].to] = 0;
          } else {
            accounts[txnList[i].to] += 1;
          }
        }
        return accounts;
      }
      function sortActivity(activity){
        var sortable = [];
        for (var a in activity) {
            sortable.push([a, activity[a]]);
        }
        sortable.sort(function(a, b) {
            return a[1] - b[1];
        });
        return sortable
      }
      function getTopUsers(users){
        var numOutliers = 3;
        var length = users.length - numOutliers;
        var topTen = [];
        for (var i = length; i > length - 10; i--){
          topTen.push(users[i]);
        }
        return(topTen);
      }
      fetch('http://localhost:5000/getTime').then(res=>res.json()).then(out=>{
        var activity = getActivity(out);
        var sortedActivity = sortActivity(activity);
        var topUsers = getTopUsers(sortedActivity);
        console.log(topUsers);

        var datas = [];
        var user = [];
        for (var i = 0; i < topUsers.length; i++){
          datas.push(topUsers[i][1]);
          user.push(topUsers[i][0]);
        }
        var ctx = document.getElementById('myChart').getContext('2d');
        var myPieChart = new this.chart(ctx,{
          type: 'pie',
          data: {
            labels: user,
            datasets: [{
                label: "My First dataset",
                backgroundColor: ['#e6194b','#3cb44b','#ffe119','#0082c8','#f58231','#911eb4','#46f0f0','#f032e6','#d2f53c','#fabebe'],
                borderColor: ['#e6194b','#3cb44b','#ffe119','#0082c8','#f58231','#911eb4','#46f0f0','#f032e6','#d2f53c','#fabebe'],
                data: datas
            }]
          }
        });
      });
    }
    render() {
        return (
          <div>
            <p className="leader"> Leaderboard for CryptoKitty Transactions</p>
            <canvas id="myChart"></canvas>
            <div className="chart">
            </div>
          </div>
        );
    }
}

class TestGraphs extends React.Component {
  constructor(props) {
      super(props);
      this.d3 = window.d3;
      this.chart = window.Chart;
      this.state = { data: 1 }
  }
  componentDidUpdate(prevProps, prevState) {
      {this.renderGraph()}
  }
  componentDidMount() {
      fetch('http://localhost:5000/getTime').then(res=>res.json()).then(out=>{
          this.setState({
              data: out.result,
          })
          {this.renderGraph()}
      });
  }
  renderGraph2() {
    if (this.state.data == 1){
        return;
    } else {
        var d = this.state.data;
        var timestamps = [];
        var byHour = [];
        var currHour = [];
        var start;
        for (var x = 0; x < d.length; x++){
            if (typeof start == 'undefined'){
              start = d[x.timeStamp];
            }
            if (d[x].timeStamp - start < this.props.number*this.props.time){
                currHour.push(d[x].timeStamp);
            } else {
                byHour.push(currHour.length);
                currHour = [];
                start = d[x].timeStamp;
            }
        }
        byHour.shift();
        var lengthData = byHour.length;
        var data = byHour.splice(lengthData-10, lengthData);

    }
  }
  renderGraph() {
      if (this.state.data == 1){
          return;
      } else {
          var d = this.state.data;
          var timestamps = [];
          var byHour = [];
          var currHour = [];
          var start;
          for (var x = 0; x < d.length; x++){
              if (typeof start == 'undefined'){
                start = d[x.timeStamp];
              }
              if (d[x].timeStamp - start < this.props.number*this.props.time){
                  currHour.push(d[x].timeStamp);
              } else {
                  byHour.push(currHour.length);
                  currHour = [];
                  start = d[x].timeStamp;
              }
          }


            var gasPriceArray = [];
            var total_gas = 0;
            var start = 'undefined';
            for (var y = 0; y < d.length; y++) {
              if (typeof start == 'undefined'){
                start = d[y.timeStamp];
              }
              if (d[y].timeStamp - start < this.props.number*this.props.time){
                  total_gas += parseInt(d[y].gasUsed);
              } else {
                  gasPriceArray.push(total_gas);
                  total_gas = 0;
                  start = d[y].timeStamp;
              }
            }

            var totalGasPriceArray = [];
            var curr_gas = 0;
            var start = 'undefined';
            for (var z = 0; z < d.length; z++) {
              if (typeof start == 'undefined'){
                start = d[z.timeStamp];
              }
              if (d[z].timeStamp - start < this.props.number*this.props.time){
                  if (parseInt(d[z].cumulativeGasUsed) > curr_gas) {
                    curr_gas = parseInt(d[z].cumulativeGasUsed);
                  }
              } else {
                  totalGasPriceArray.push(curr_gas);
                  total_gas = 0;
                  start = d[z].timeStamp;
              }
            }


          byHour.shift();
          var lengthData = byHour.length;
          var data = byHour.splice(lengthData-10, lengthData);
        var gasPriceData = {
            labels: ["10hr","9hr","8hr","7hr","6hr","5hr","4hr","3hr","2hr","1hr",],
            datasets: [{
                label: "Amount of Gas Used in Transactions",
                backgroundColor: "#e6194b",
                borderColor: "#e6194b",
                borderWidth: 1,
                data: gasPriceArray
            }, {
               label: 'Cumulative Gas used',
               backgroundColor: '#f032e6',
               borderColor: '#f032e6',
               borderWidth: 1,
               data: totalGasPriceArray
            }]
        };
        var barChartData = {
                labels: ["10hr","9hr","8hr","7hr","6hr","5hr","4hr","3hr","2hr","1hr",],
                datasets: [{
                    label: "Number of Transactions",
                    backgroundColor: '#3cb44b',
                    borderColor: '#3cb44b',
                    borderWidth: 1,
                    data: data
                }]
        };
          var ctx = document.getElementById('myChart').getContext('2d');
          var myBarChart = new this.chart(ctx, {
            type: 'bar',
            data: barChartData,
            options: {
                responsive: true,
                legend: {
                    position: 'top',
                },
                title: {
                    display: true,
                    text: 'CryptoKitties Traffic'
                },
                scales: {
                  xAxes: [{
                      stacked: true
                  }],
                  yAxes: [{
                      stacked: true
                  }]
              }
            }
        });
          var ctx1 = document.getElementById('myChart1').getContext('2d');
          var gasPriceChart = new this.chart(ctx1, {
            type: 'bar',
            data: gasPriceData,
            options: {
                responsive: true,
                legend: {
                    position: 'top',
                },
                title: {
                    display: true,
                    text: 'CryptoKitties Gas Price'
                },
                scales: {
                  xAxes: [{
                      stacked: true
                  }],
                  yAxes: [{
                      stacked: true
                  }]
              }
            }
        });
        }
      }
  render() {
      return (
          <div>
              <canvas id="myChart" className="scale"></canvas>
              <div className="chart"></div>
              <canvas id="myChart1" className="scale"></canvas>
              <div className="chartGasPrice"></div>
          </div>
      );
  }
}

export default App;