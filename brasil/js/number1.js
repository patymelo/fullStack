import { readFileSync, writeFileSync } from 'fs';

const readFile = (filename) => readFileSync(filename, 'UTF-8');
const saveFile = (filename, content) =>
  writeFileSync(filename, content, 'UTF-8');
const jsonToObject = (string) => JSON.parse(string);

//lendo arquivos
const estados = jsonToObject(readFile('../json/Estados.json'));
const cidades = jsonToObject(readFile('../json/Cidades.json'));

//usando map, filter e sort
//Essa é apenas uma função que dado o id de um estado
// procura no array de cidades a com o mesmo id
const filterCityByState = (stateId, cities) =>
  cities.filter((city) => city.Estado === stateId);

//Função de salvar que recebe o nome da sigla do Estado e
//o conteúdo é a string dos arrays filtrados, e faz isso para cada estado
//:) Ao executar essa função será criado vários arquivos JSONS no formato esperado
function statesToJSON(states, cities) {
  states.forEach((state) => {
    const citiesOfState = filterCityByState(state.ID, cities);
    console.log('estados ' + `${state.Sigla}` + ' salvo com sucesso!');
    saveFile(
      '../estados/' + `${state.Sigla}.json`,
      JSON.stringify(citiesOfState, null, 4)
    );
  });
}

function saveEstatesCities() {
  statesToJSON(estados, cidades);
}

saveEstatesCities();
