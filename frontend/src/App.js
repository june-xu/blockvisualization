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
              <a className="mdl-navigation__link" href="/topics">Topics</a>
              <a className="mdl-navigation__link" href="">Test</a>
              <a className="mdl-navigation__link" href="">Graphs</a> 
            </nav>
          </div>
          <main className="mdl-layout__content content">
              <Route exact path="/" component={Home} />
              <Route path="/blocks" component={Blocks} />
              <Route path="/topics" component={Topics} />
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
          <div className="selectors">
            <DropDownMenu value={this.state.value} onChange={this.handleChange1} className="dropdown" style="width: 200px; font-family: Montserrat;">
              <MenuItem value={1} primaryText="1"/>
              <MenuItem value={2} primaryText="5" />
              <MenuItem value={3} primaryText="10" />
              <MenuItem value={4} primaryText="15" />
              <MenuItem value={5} primaryText="30" />
            </DropDownMenu>
            <DropDownMenu value={this.state.hours} onChange={this.handleChange2} className="dropdown">
              <MenuItem value={1} primaryText="Mins" />
              <MenuItem value={2} primaryText="Hours" />
              <MenuItem value={3} primaryText="Days" />
              <MenuItem value={4} primaryText="Weeks" />
            </DropDownMenu>
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
        console.log(data);
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
        this.state.blocks = [];
    }
    componentDidMount() {
        fetch('http://localhost:5000/blocks').then(res=>res.json()).then(out=>{
          this.setState({
            blocks: out,
          })
          var data = this.d3.range(1000).map(this.d3.randomBates(10));
          console.log(data);
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
        });
    }
    render() {
        return (
           <div>
            <svg></svg>
           </div>
        );
    }
}

const Topics = ({ match }) => (
  <div>
    <h2>Topics</h2>
    <ul>
      <li>
        <Link to={`${match.url}/rendering`}>Rendering with React</Link>
      </li>
      <li>
        <Link to={`${match.url}/components`}>Components</Link>
      </li>
      <li>
        <Link to={`${match.url}/props-v-state`}>Props v. State</Link>
      </li>
    </ul>

    <Route path={`${match.url}/:topicId`} component={Topic} />
    <Route
      exact
      path={match.url}
      render={() => <h3>Please select a topic.</h3>}
    />
  </div>
);

const Topic = ({ match }) => (
  <div>
    <h3>{match.params.topicId}</h3>
  </div>
);

export default App;