import React from 'react';
import { postBackend } from '../../utils/apiHelper';
//import Montserrat from 'typeface-montserrat';

class AccountActivity extends React.Component {
  constructor(props) {
    super(props);
    this.d3 = window.d3;
    this.chart = window.Chart;
    this.state.blocks = [];
  }

  componentDidMount() {
    function getActivity(data) {}

    postBackend()
      .then(out => {
        this.setState({ blocks: out.data }, () => {
          getActivity(out);
        });
        return getActivity(out);
      })
      .then(activity => {
        return sortActivity(activity);
      })
      .then(sortedActivity => {
        return getTopUsers(sortedActivity);
      })
      .then(topUsers => {
        console.log(topUsers);
        var datas = [];
        var user = [];
        for (var i = 0; i < topUsers.length; i++) {
          datas.push(topUsers[i][1]);
          user.push(topUsers[i][0]);
        }
      });

    const getActivity = data => {
      var accounts = {};
      var txnList = data.result;

      Array.prototype.forEach((value, index) => {
        if (!(txnList[index].from in accounts)) {
          accounts[txnList[index].from] = 0;
        } else {
          accounts[txnList[index].from] += 1;
        }
        if (!(txnList[index].to in accounts)) {
          accounts[txnList[index].to] = 0;
        } else {
          accounts[txnList[index].to] += 1;
        }
      });

      return accounts;
    };

    const sortActivity = activity => {
      var sortable = [];
      for (var a in activity) {
        sortable.push([a, activity[a]]);
      }
      sortable.sort(function(a, b) {
        return a[1] - b[1];
      });

      getTopUsers(sortable);
    };

    const getTopUsers = users => {
      var numOutliers = 3;
      var length = users.length - numOutliers;
      var topTen = [];
      for (var i = length; i > length - 10; i--) {
        topTen.push(users[i]);
      }
    };

    // console.log();
    //var ctx = document.getElementById('myChart').getContext('2d');
    // var myPieChart = new this.chart(ctx, {
    //   type: 'pie',
    //   data: {
    //     labels: user,
    //     datasets: [
    //       {
    //         label: 'My First dataset',
    //         backgroundColor: [
    //           '#e6194b',
    //           '#3cb44b',
    //           '#ffe119',
    //           '#0082c8',
    //           '#f58231',
    //           '#911eb4',
    //           '#46f0f0',
    //           '#f032e6',
    //           '#d2f53c',
    //           '#fabebe'
    //         ],
    //         borderColor: [
    //           '#e6194b',
    //           '#3cb44b',
    //           '#ffe119',
    //           '#0082c8',
    //           '#f58231',
    //           '#911eb4',
    //           '#46f0f0',
    //           '#f032e6',
    //           '#d2f53c',
    //           '#fabebe'
    //         ],
    //         data: datas
    //       }
    //     ]
    //   }
    // options: options
    //   });

    //   // var x = this.d3.scale.linear()
    //   //   .domain([0, this.d3.max(data)])
    //   //   .range([0, 420]);

    //   // this.d3.select(".chart")
    //   //   .selectAll("div")
    //   //   .data(topUsers)
    //   //   .enter().append()
    //   //   .attr("fill","black")
    //   //   .style("width", function(d) { return x(d[1]) + "px"; })
    //   //   .attr("fill","white")
    //   //   .text(function(d) { return d[0]; });
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
export default AccountActivity;
