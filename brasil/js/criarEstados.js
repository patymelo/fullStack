import { promises as fs } from 'fs';
import { writeFileSync } from 'fs';

writeReadJson();

async function writeReadJson() {
  try {
    const estados = JSON.parse(await fs.readFile('../json/Estados.json'));
    const cidades = JSON.parse(await fs.readFile('../json/Cidades.json'));

    const mapear = (resultado, { Estado: estado, ...cidade }) => {
      const acumulador = resultado.get(estado) || [];
      return resultado.set(estado, [...acumulador, cidade]);
    };

    const salvar = (mapa, { ID: id, Sigla: sigla }) => {
      writeFileSync(
        '../estados/' + `${sigla}.json`,
        JSON.stringify(mapa.get(id), null, 2)
      );
    };

    const mapa = cidades.reduce(mapear, new Map());
    estados.forEach((estado) => salvar(mapa, estado));

    console.log('Estados criados com sucesso!');
  } catch (err) {
    console.log(err);
  }
}
