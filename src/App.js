import React from 'react';
import './App.css';
import monday from 'monday-sdk-js';

class App extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      settings: {},
      context: {},
      boardIds: [],
      itemCount: null,
    }
  }

  // initialize component with settings
  componentDidMount() {
    // set up listeners
    monday.listen("settings", this.getSettings);
    monday.listen("context", this.getContext);
  }

  // bind settings to app state
  getSettings = res => {
    this.setState({settings: res.data});
  }

  getContext = res => {
    // set app state
    this.setState({context: res.data});
    this.setState({boardIds: this.state.context.boardIds});

    // make API call
    if (this.state.boardIds.length > 0) {
      monday.api(`query ($boardIds: [Int]) { boards (ids:$boardIds) { items { id } } }`,
        { variables: {boardIds: this.state.boardIds} }
      )
      .then(res => this.countItems(res))
      .catch(err => console.log(err));
    } else {
      this.setState({itemCount: 0});
    }
  }

  countItems = res => {
    let count = 0;
    res.data.boards.forEach(board => {
      count += board.items.length;
    });
    this.setState({itemCount: count});
  }

  render() {
    return (
      <div
        className="App"
        style={{color: (this.state.settings.color)}}
        >
        Hello world! <br/>
        The number of items on the connected boards are {this.state.itemCount}
      </div>
    );
  }
}

export default App;
