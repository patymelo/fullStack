import React, { Component } from 'react';

export default class TextCSV extends Component {
  render() {
    const { inputTextCSV } = this.props;
    return (
      <div>
        <label>CSV:</label>
        <input type="text" readOnly value={inputTextCSV} />
      </div>
    );
  }
}
