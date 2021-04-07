import React, { Component } from 'react';

export default class TextVogais extends Component {
  render() {
    const { inputTextVogais } = this.props;
    return (
      <div>
        <label>Somente Vogais:</label>
        <input type="text" readOnly value={inputTextVogais} />
      </div>
    );
  }
}
