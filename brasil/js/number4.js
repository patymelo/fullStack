import { readFileSync, writeFileSync } from 'fs';

const readFile = (filename) => readFileSync(filename, 'UTF-8');
const saveFile = (filename, content) =>
  writeFileSync(filename, content, 'UTF-8');
const jsonToObject = (string) => JSON.parse(string);
//lendo arquivos
const estados = jsonToObject(readFile('../json/Estados.json'));
const cidades = jsonToObject(readFile('../json/Cidades.json'));

//precisamos ler o arquivo e pegar apenas a quantidade:

const stateNumberOfCities = (uf) =>
  jsonToObject(readFile('../estados/' + `${uf}.json`)).length;

//funcoes de ordenacao
//Onde temos asc para ordenar valores de maneira crescente,
//e desc para decrescente para valors numéricos
const ascCriteriaForLenght = (a, b) => {
  if (a.Nome.length < b.Nome.length) return -1;
  if (a.Nome.length > b.Nome.length) return 1;
  if (a.Nome.length == b.Nome.length) return a.Nome.localeCompare(b.Nome);
};

const descCriteriaForLength = (a, b) => {
  if (a.Nome.length < b.Nome.length) return 1;
  if (a.Nome.length > b.Nome.length) return -1;
  if (a.Nome.length == b.Nome.length) return a.Nome.localeCompare(b.Nome);
};

//filtro
function filterCityFromStateByLength(states, criteria) {
  const result = [];

  states.forEach((state) => {
    const biggerCityName = jsonToObject(
      readFile('../estados/' + `${state.Sigla}.json`)
    ).sort(criteria)[0];
    result.push(`${biggerCityName.Nome} - ${state.Sigla}`);
  });

  return result;
}

const stateLargerName = filterCityFromStateByLength(
  estados,
  descCriteriaForLength
);
const stateSmallerName = filterCityFromStateByLength(
  estados,
  ascCriteriaForLenght
).reverse();

//console.log('Estado maior nome: ' + stateLargerName);
//console.log('Estado menor nome: ' + stateSmallerName);

function filterTheMostCityFromAllStates(states, cities, criteria) {
  const nameOfCity = cities
    .map((city) => ({ Nome: city.Nome, uf: city.Estado }))
    .sort(criteria)[0];
  const UFOfCity = states.filter((state) => state.ID === nameOfCity.uf)[0];

  return `${nameOfCity.Nome} - ${UFOfCity.Nome}`;
}

// Filtrar as Maiores
const biggestCity = filterTheMostCityFromAllStates(
  estados,
  cidades,
  ascCriteriaForLenght
);
console.log(biggestCity);
const smallestCity = filterTheMostCityFromAllStates(
  estados,
  cidades,
  descCriteriaForLength
);
console.log(smallestCity);
