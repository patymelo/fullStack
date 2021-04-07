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
const descCriteriaForNumbers = (a, b) => b.count - a.count;
const ascCriteriaForNumbers = (a, b) => a.count - b.count;

//filtro
function filterStatesByNumbeOfCities(states, criteria) {
  const arrayWithNumberOfCities = states.map((state) => ({
    ...state,
    count: stateNumberOfCities(state.Sigla),
  }));
  const sortedArray = arrayWithNumberOfCities.sort(criteria);
  const result = sortedArray
    .slice(0, 5) //traz os 5 primeiros
    .map((state) => `${state.Sigla} - ${state.count}`);

  return result;
}

const top5EstadosComMaioresCidades = filterStatesByNumbeOfCities(
  estados,
  descCriteriaForNumbers
);
const top5EstadosComMenoresCidades = filterStatesByNumbeOfCities(
  estados,
  ascCriteriaForNumbers
).reverse();

const somatop5EstadosComMenoresCidades = top5EstadosComMenoresCidades
  .map((state) => ({ ...state }))
  .reduce((accumulator, number) => {
    return accumulator + number;
  });

//console.log('UF com mais cidades: ' + top5EstadosComMaioresCidades);
//console.log('UF com menas cidades: ' + top5EstadosComMenoresCidades);
console.log('UF com menas cidades: ' + somatop5EstadosComMenoresCidades);
