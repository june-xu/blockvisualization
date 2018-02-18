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
              <span className="mdl-layout-title header">Block Explorer</span>
              <div className="mdl-layout-spacer"></div>
            </div>
          </header>
          <div className="mdl-layout__drawer">
            <span className="mdl-layout-title menu">Menu</span>
            <nav className="mdl-navigation">
              <a className="mdl-navigation__link" href="/">Home</a>
              <a className="mdl-navigation__link" href="/blocks">Blocks</a>
              <a className="mdl-navigation__link" href="">Test</a>
              <a className="mdl-navigation__link" href="">Graphs</a>
            </nav>
          </div>
          <main className="mdl-layout__content content">
              <Route exact path="/" component={Home} />
              <Route path="/blocks" component={Blocks} />
              <Route path="/test" component={TestGraphs} />
              <Route path="/graphs" component={Graphs} />
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
          hours: 1,
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
      <div>
        <h2>Blocks</h2>
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

class Graphs extends React.Component {
    constructor(props) {
        super(props);
        this.d3 = window.d3;
    }
    componentDidMount() {
        var data = this.d3.range(1000).map(this.d3.randomBates(10));
        var formatCount = this.d3.format(",.0f");

        var svg = this.d3.select("svg"),
            margin = {top: 10, right: 30, bottom: 30, left: 30},
            width = +svg.attr("width") - margin.left - margin.right,
            height = +svg.attr("height") - margin.top - margin.bottom,
            g = svg.append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");

        var x = this.d3.scaleLinear()
            .rangeRound([0, width]);

        var bins = this.d3.histogram()
            .domain(x.domain())
            .thresholds(x.ticks(20))
            (data);

        var y = this.d3.scaleLinear()
            .domain([0, this.d3.max(bins, function(d) { return d.length; })])
            .range([height, 0]);

        var bar = g.selectAll(".bar")
          .data(bins)
          .enter().append("g")
            .attr("class", "bar")
            .attr("transform", function(d) { return "translate(" + x(d.x0) + "," + y(d.length) + ")"; });

        bar.append("rect")
            .attr("x", 1)
            .attr("width", x(bins[0].x1) - x(bins[0].x0) - 1)
            .attr("height", function(d) { return height - y(d.length); });

        bar.append("text")
            .attr("dy", ".75em")
            .attr("y", 6)
            .attr("x", (x(bins[0].x1) - x(bins[0].x0)) / 2)
            .attr("text-anchor", "middle")
            .text(function(d) { return formatCount(d.length); });

        g.append("g")
            .attr("class", "axis axis--x")
            .attr("transform", "translate(0," + height + ")")
            .call(this.d3.axisBottom(x));
     }
    render() {
        return (
            <div>
              <svg width="700" height="250"></svg>
            </div>
        );
    }
}

class TestGraphs extends React.Component {
    constructor(props) {
        super(props);
        this.d3 = window.d3;
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
            byHour.shift();
            var lengthData = byHour.length;
            var data = byHour.splice(lengthData-10, lengthData);
            var x = this.d3.scale.linear()
                .domain([0, this.d3.max(data)])
                .range([0, 420]);
            this.d3.select(".chart")
                .selectAll("div")
                .data(data)
                .enter().append("div")
                .attr("fill","black")
                .style("width", function(d) { return x(d) + "px"; })
                .attr("fill","white")
                .text(function(d) { return d; });
        }
    }
    render() {
        return (
            <div>
                {this.renderGraph()}
                <div className="chart"></div>
            </div>
        );
    }
}

export default App;