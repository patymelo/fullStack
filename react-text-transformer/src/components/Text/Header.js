import React, { Component } from 'react';
import InvertedText from './InvertedText';
import NumericText from './NumericText';
import TextSlug from './TextSlug';
import TextCSV from './TextCSV';
import TextVogais from './TextVogais';
import TextConsoantes from './TextConsoantes';
import TextVariavel from './TextVariavel';

export default class Header extends Component {
  constructor() {
    super();
    this.state = {
      inputInvertedText: '',
      inputNumericText: '',
      inputTextCSV: '',
      inputTextSlug: '',
      inputTextVogais: '',
      inputTextConsoantes: '',
      inputTextVariavel: '',
    };
  }

  handleInputChangeName = (event) => {
    const inputText = event.target.value;
    this.props.onChangeFilterName(inputText);
    this.handleInvertedText(inputText);
    this.handleNumericText(inputText);
    this.handleInputTextCSV(inputText);
    this.handleInputTextSlug(inputText);
    this.handleInputTextVogais(inputText);
    this.handleInputTextConsoantes(inputText);
    this.handleInputTextVariaval(inputText);
  };

  handleInvertedText = (text) => {
    const inputNameInvertid = text.split('').reverse().join('');
    this.setState({
      inputInvertedText: inputNameInvertid,
    });
  };

  handleNumericText = (text) => {
    const textString = text
      .toUpperCase()
      .normalize('NFD')
      .replace(/[^a-zA-Zs ]/g, '');
    const inputNumericText = textString
      .replaceAll('O', 0)
      .replaceAll('L', 1)
      .replaceAll('E', 3)
      .replaceAll('A', 4)
      .replaceAll('S', 5)
      .replaceAll('T', 7);

    this.setState({
      inputNumericText,
    });
  };

  handleInputTextCSV = (text) => {
    const textAspas = text.split(' ').map((t) => {
      return '"' + t + '"';
    });
    const inputTextCSV = textAspas.join(';');
    this.setState({
      inputTextCSV,
    });
  };

  handleInputTextSlug = (text) => {
    const textSplit = text
      .toUpperCase()
      .normalize('NFD')
      .replace(/[^a-zA-Zs ]/g, '')
      .toLowerCase()
      .split(' ');
    const inputTextSlug = textSplit.join('-');
    this.setState({
      inputTextSlug,
    });
  };

  handleInputTextVogais = (text) => {
    const inputTextVogais = text.replace(/[^aeiou]/gi, '');
    this.setState({
      inputTextVogais,
    });
  };

  handleInputTextConsoantes = (text) => {
    const inputTextConsoantes = text.replace(/[aeiou]/gi, '');
    this.setState({
      inputTextConsoantes,
    });
  };

  handleInputTextVariaval = (text) => {
    const inputTextVariavel = text
      .toLowerCase()
      .replace(/[^a-zA-Z0-9]+(.)/g, (m, chr) => {
        return chr.toUpperCase();
      });

    this.setState({
      inputTextVariavel,
    });
  };

  render() {
    const { filterName } = this.props;
    const {
      inputInvertedText,
      inputNumericText,
      inputTextCSV,
      inputTextSlug,
      inputTextVogais,
      inputTextConsoantes,
      inputTextVariavel,
    } = this.state;
    return (
      <div>
        <input
          type="text"
          placeholder="Digite um texto qualquer:"
          value={filterName}
          onChange={this.handleInputChangeName}
        />

        <h4>Transformações</h4>
        <InvertedText inputInvertedText={inputInvertedText} />
        <NumericText inputNumericText={inputNumericText} />
        <TextCSV inputTextCSV={inputTextCSV} />
        <TextSlug inputTextSlug={inputTextSlug} />
        <TextVogais inputTextVogais={inputTextVogais} />
        <TextConsoantes inputTextConsoantes={inputTextConsoantes} />
        <TextVariavel inputTextVariavel={inputTextVariavel} />
      </div>
    );
  }
}
