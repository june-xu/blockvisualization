import React from 'react';
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import logo from './logo.svg';
import './App.css';

const App = () => (
  <Router>
    <div>
      <ul>
        <li>
          <Link to="/">Home</Link>
        </li>
        <li>
          <Link to="/blocks">Blocks</Link>
        </li>
        <li>
          <Link to="/topics">Topics</Link>
        </li>
        <li>
          <Link to="/test">Test</Link>
        </li>
        <li>
          <Link to="/graphs">Graphs</Link>
        </li>
      </ul>

      <hr />

      <Route exact path="/" component={Home} />
      <Route path="/block/:blockNum" component={Block} />
      <Route path="/blocks" component={Blocks} />
      <Route path="/topics" component={Topics} />
      <Route path="/test" component={TestGraphs} />
      <Route path="/graphs" component={Graphs} />
    </div>
  </Router>
);

const Home = () => (
  <div>
    <h2>dteam</h2>
  </div>
);

const BlockEntry = ({ blockNum, timestamp, numTxns }) => (
  <tr>
    <td><Link to={"/block/"+blockNum}>{blockNum}</Link></td>
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
    }
    componentDidMount() {
        var sales = [
          { product: 'Hoodie',  count: 7 },
          { product: 'Jacket',  count: 6 },
          { product: 'Snuggie', count: 9 },
        ];
        var pie = this.d3.pie().value(function(d) { return d.count })
        var slices = pie(sales);
        var arc = this.d3.arc()
          .innerRadius(0)
          .outerRadius(50);

        // helper that returns a color based on an ID
        var color = this.d3.scaleOrdinal(this.d3.schemeCategory10);

        var svg = this.d3.select('svg');
        var g = svg.append('g').attr('transform', 'translate(200, 50)')

        g.selectAll('path.slice')
          .data(slices)
            .enter()
              .append('path')
                .attr('class', 'slice')
                .attr('d', arc)
                .attr('fill', function(d) {
                  return color(d.data.product);
                });

        // building a legend is as simple as binding
        // more elements to the same data. in this case,
        // <text> tags
        svg.append('g')
          .attr('class', 'legend')
            .selectAll('text')
            .data(slices)
              .enter()
                .append('text')
                  .text(function(d) { return '• ' + d.data.product; })
                  .attr('fill', function(d) { return color(d.data.product); })
                  .attr('y', function(d, i) { return 20 * (i + 1); })
    }
    render() {
        return (
           <div>
            <svg></svg>
           </div>
        );
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
