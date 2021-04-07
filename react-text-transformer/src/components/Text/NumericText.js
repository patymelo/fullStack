import React, { Component } from 'react';

export default class NumericText extends Component {
  render() {
    const { inputNumericText } = this.props;
    return (
      <div>
        <label>Texto Numérico:</label>
        <input type="text" readOnly value={inputNumericText} />
      </div>
    );
  }
}
