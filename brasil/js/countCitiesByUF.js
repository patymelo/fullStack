import { promises as fs } from 'fs';
import readline from 'readline';

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

questionCities();

async function questionCities() {
  rl.question('Digite uma UF: ', (uf) => {
    findUF(uf);
  });
}

async function findUF(uf) {
  try {
    let arq = '../estados/' + uf + '.json';
    const es = JSON.parse(await fs.readFile(arq));
    console.log('Quantidade de cidades do estado ' + uf + ': ' + es.length);
  } catch (err) {
    console.log(err);
  }
}
