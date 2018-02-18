import React from 'react';
import { postBackend } from '../../utils/apiHelper';
//import Montserrat from 'typeface-montserrat';

const BlockEntry = ({ blockNum, timestamp, numTxns }) => (
  <tr>
    <td>{blockNum}</td>
    <td>{new Date(timestamp * 1000).toString()}</td>
    <td>{numTxns}</td>
  </tr>
);

class Blocks extends React.Component {
  constructor(props) {
    super(props);
    this.state = { blocks: [] };
  }

  componentDidMount() {
    postBackend().then(out => {
      this.setState({
        blocks: out
      });
    });
  }

  render() {
    return (
      <div>
        <h2>Blocks</h2>
        <table>
          <tbody>
            <tr>
              <td>Block Height</td>
              <td>Timestamp</td>
              <td># Transactions</td>
            </tr>
            {this.state.blocks.map(block => (
              <BlockEntry
                key={block.blockNum}
                timestamp={block.timestamp}
                blockNum={block.blockNum}
                numTxns={block.txns}
              />
            ))}
          </tbody>
        </table>
      </div>
    );
  }
}

export default Blocks;
