import React, { Component } from 'react';

export default class TextConsoantes extends Component {
  render() {
    const { inputTextConsoantes } = this.props;
    return (
      <div>
        <label>Somente Consoantes:</label>
        <input type="text" readOnly value={inputTextConsoantes} />
      </div>
    );
  }
}
