import React, { Component } from 'react';

export default class InvertedText extends Component {
  render() {
    const { inputInvertedText } = this.props;
    return (
      <div>
        <label>Texto Invertido:</label>
        <input type="text" readOnly value={inputInvertedText} />
      </div>
    );
  }
}
