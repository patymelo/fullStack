import { promises as fs } from 'fs';

const dirEstados = '../estados';
let totalUF = 0;

readEstados();
let arrayObj = [];
async function readEstados() {
  try {
    (await fs.readdir(dirEstados)).forEach((file) => {
      countCities(file);
    });
  } catch (err) {
    console.log(err);
  }
}

async function countCities(file) {
  try {
    let arq = '../estados/' + file;
    const es = JSON.parse(await fs.readFile(arq));
    let count = es.length;
    let uf = file.substr(0, 2);
    let dados = { UF: uf, cidades: count };
    arrayObj.push(dados);
    arrayObj.sort((a, b) => {
      return b.cidades - a.cidades;
    });
  } catch (err) {
    console.log(err);
  }
}
