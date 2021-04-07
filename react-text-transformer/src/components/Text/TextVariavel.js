import React, { Component } from 'react';

export default class TextVariavel extends Component {
  render() {
    const { inputTextVariavel } = this.props;
    return (
      <div>
        <label>Variável:</label>
        <input type="text" readOnly value={inputTextVariavel} />
      </div>
    );
  }
}
