import React, { Component } from 'react';
import Header from './components/Text/Header';

export default class App extends Component {
  constructor() {
    super();
    this.state = {
      userInput: '',
    };
  }

  handleChangeFilterName = (newName) => {
    this.setState({
      userInput: newName,
    });
  };

  render() {
    const { userInput } = this.state;
    return (
      <div className="container">
        <h1>react-text-transformer</h1>
        <Header
          userInput={userInput}
          onChangeFilterName={this.handleChangeFilterName}
        />
      </div>
    );
  }
}
