import React, { Component } from 'react';

export default class TextSlug extends Component {
  render() {
    const { inputTextSlug } = this.props;
    return (
      <div>
        <label>Slug:</label>
        <input type="text" readOnly value={inputTextSlug} />
      </div>
    );
  }
}
