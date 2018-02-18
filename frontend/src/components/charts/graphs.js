import React from 'react';
const d3 = require('d3-random');

class Graphs extends React.Component {
  constructor(props) {
    super(props);
    this.d3 = window.d3;
  }
  componentDidMount() {
    var data = this.d3.range(1000).map(this.d3.randomBates(10));
    var formatCount = this.d3.format(',.0f');

    var svg = this.d3.select('svg'),
      margin = { top: 10, right: 30, bottom: 30, left: 30 },
      width = +svg.attr('width') - margin.left - margin.right,
      height = +svg.attr('height') - margin.top - margin.bottom,
      g = svg
        .append('g')
        .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

    var x = this.d3.scaleLinear().rangeRound([0, width]);

    var bins = this.d3
      .histogram()
      .domain(x.domain())
      .thresholds(x.ticks(20))(data);

    var y = this.d3
      .scaleLinear()
      .domain([
        0,
        this.d3.max(bins, function(d) {
          return d.length;
        })
      ])
      .range([height, 0]);

    var bar = g
      .selectAll('.bar')
      .data(bins)
      .enter()
      .append('g')
      .attr('class', 'bar')
      .attr('transform', function(d) {
        return 'translate(' + x(d.x0) + ',' + y(d.length) + ')';
      });

    bar
      .append('rect')
      .attr('x', 1)
      .attr('width', x(bins[0].x1) - x(bins[0].x0) - 1)
      .attr('height', function(d) {
        return height - y(d.length);
      });

    bar
      .append('text')
      .attr('dy', '.75em')
      .attr('y', 6)
      .attr('x', (x(bins[0].x1) - x(bins[0].x0)) / 2)
      .attr('text-anchor', 'middle')
      .text(function(d) {
        return formatCount(d.length);
      });

    g
      .append('g')
      .attr('class', 'axis axis--x')
      .attr('transform', 'translate(0,' + height + ')')
      .call(this.d3.axisBottom(x));
  }
  render() {
    return (
      <div>
        <svg width="700" height="250" />
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
      var accounts = {};
      var txnList = data.result;
      for (var i = 0; i < txnList.length; i++) {
        if (!(txnList[i].from in accounts)) {
          accounts[txnList[i].from] = 0;
        } else {
          accounts[txnList[i].from] += 1;
        }
        if (!(txnList[i].to in accounts)) {
          accounts[txnList[i].to] = 0;
        } else {
          accounts[txnList[i].to] += 1;
        }
      }
      return accounts;
    }
    function sortActivity(activity) {
      var sortable = [];
      for (var a in activity) {
        sortable.push([a, activity[a]]);
      }
      sortable.sort(function(a, b) {
        return a[1] - b[1];
      });
      return sortable;
    }
    function getTopUsers(users) {
      var numOutliers = 3;
      var length = users.length - numOutliers;
      var topTen = [];
      for (var i = length; i > length - 10; i--) {
        topTen.push(users[i]);
      }
      return topTen;
    }
    postBackend()
      .then(out => {
        var activity = getActivity(out);
        var sortedActivity = sortActivity(activity);
        var topUsers = getTopUsers(sortedActivity);
        console.log(topUsers);

        var datas = [];
        var user = [];
        for (var i = 0; i < topUsers.length; i++) {
          datas.push(topUsers[i][1]);
          user.push(topUsers[i][0]);
        }
        // console.log();
        var ctx = document.getElementById('myChart').getContext('2d');
        var myPieChart = new this.chart(ctx, {
          type: 'pie',
          data: {
            labels: user,
            datasets: [
              {
                label: 'My First dataset',
                backgroundColor: [
                  '#e6194b',
                  '#3cb44b',
                  '#ffe119',
                  '#0082c8',
                  '#f58231',
                  '#911eb4',
                  '#46f0f0',
                  '#f032e6',
                  '#d2f53c',
                  '#fabebe'
                ],
                borderColor: [
                  '#e6194b',
                  '#3cb44b',
                  '#ffe119',
                  '#0082c8',
                  '#f58231',
                  '#911eb4',
                  '#46f0f0',
                  '#f032e6',
                  '#d2f53c',
                  '#fabebe'
                ],
                data: datas
              }
            ]
          }
          // options: options
        });

        // var x = this.d3.scale.linear()
        //   .domain([0, this.d3.max(data)])
        //   .range([0, 420]);

        // this.d3.select(".chart")
        //   .selectAll("div")
        //   .data(topUsers)
        //   .enter().append()
        //   .attr("fill","black")
        //   .style("width", function(d) { return x(d[1]) + "px"; })
        //   .attr("fill","white")
        //   .text(function(d) { return d[0]; });
      });
  }
  render() {
    return (
      <div>
        <canvas id="myChart" />
        <div className="chart" />
      </div>
    );
  }

export default Graphs;
