import React from 'react';
import DropDownMenu from 'material-ui/DropDownMenu';
import MenuItem from 'material-ui/MenuItem';
import TestGraphs from './charts/testGraphs';
import Montserrat from 'typeface-montserrat';

const homeStyle = {};
class Home extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      value: 1,
      hours: 60
    };
  }
  handleChange1 = (event, index, value) => this.setState({ value });
  handleChange2 = (event, index, hours) => this.setState({ hours });
  render() {
    return (
      <div className="container">
        <div className="selectors">
          <DropDownMenu
            value={this.state.value}
            onChange={this.handleChange1.bind(this)}
            className="dropdown"
            style={{ width: 200, fontFamily: Montserrat }}
          >
            <MenuItem value={1} primaryText="1" />
            <MenuItem value={5} primaryText="5" />
            <MenuItem value={10} primaryText="10" />
            <MenuItem value={15} primaryText="15" />
            <MenuItem value={30} primaryText="30" />
          </DropDownMenu>
          <DropDownMenu
            value={this.state.hours}
            onChange={this.handleChange2.bind(this)}
            className="dropdown"
          >
            <MenuItem value={60} primaryText="Mins" />
            <MenuItem value={3600} primaryText="Hours" />
            <MenuItem value={86400} primaryText="Days" />
            <MenuItem value={604800} primaryText="Weeks" />
          </DropDownMenu>
        </div>
        <TestGraphs number={this.state.value} time={this.state.hours} />
      </div>
    );
  }
}

export default Home;
