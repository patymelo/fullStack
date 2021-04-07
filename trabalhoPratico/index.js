import { lstat, promises as fs } from 'fs';
init();
async function init() {
  //await createFiles();
  //await getStatesWithMoreOrLessCites(true);
  //await getStatesWithMoreOrLessCites(false);
  //await getBiggerOrSmallerNameCities(true);
  //await getBiggerOrSmallerNameCities(false);
  await getBiggerOrSmallCityName(true);
  await getBiggerOrSmallCityName(false);
}

async function getCitesCount(uf) {
  const data = await fs.readFile(`./states/${uf}.json`);
  const cities = JSON.parse(data);
  const totalCites = cities.length;
  return totalCites;
  //console.log(`Estado ${uf} tem ${totalCites} cidades`);
}

async function getBiggerOrSmallCityName(bigger) {
  const states = JSON.parse(await fs.readFile('./files/Estados.json'));
  const list = [];
  let name;
  for (let state of states) {
    const sigla = state.Sigla;
    if (bigger) {
      name = await getBiggerName(sigla);
    } else {
      name = await getSmallerName(sigla);
    }
    list.push({ sigla, name });
  }
  const result = list.reduce((prev, current) => {
    //console.log(current.name.length);
    if (bigger) {
      if (prev.name.length > current.name.length) return prev;
      else if (prev.name.length < current.name.length) return current;
      else
        return prev.name.toLowerCase() < current.name.toLowerCase()
          ? prev
          : current;
    } else {
      if (prev.name.length < current.name.length) return prev;
      else if (prev.name.length > current.name.length) return current;
      else
        return prev.name.toLowerCase() < current.name.toLowerCase()
          ? prev
          : current;
    }
  });

  console.log(result);
}
async function getBiggerName(uf) {
  const cities = JSON.parse(await fs.readFile(`./states/${uf}.json`));
  let result;
  cities.forEach((city) => {
    if (!result) {
      result = city;
    } else {
      if (city.Nome.length > result.Nome.length) {
        result = city;
      } else if (
        city.Nome.length === result.Nome.length &&
        city.Nome.toLowerCase() < result.Nome.toLowerCase()
      ) {
        result = city;
      }
    }
  });
  return result.Nome;
}

async function getSmallerName(uf) {
  const cities = JSON.parse(await fs.readFile(`./states/${uf}.json`));
  let result;
  cities.forEach((city) => {
    if (!result) {
      result = city;
    } else {
      if (city.Nome.length < result.Nome.length) {
        result = city;
      } else if (
        city.Nome.length === result.Nome.length &&
        city.Nome.toLowerCase() < result.Nome.toLowerCase()
      ) {
        result = city;
      }
    }
  });
  return result.Nome;
}

async function getBiggerOrSmallerNameCities(bigger) {
  const states = JSON.parse(await fs.readFile('./files/Estados.json'));
  const list = [];
  for (let state of states) {
    const uf = state.Sigla;
    let city = '';
    if (bigger) {
      city = await getBiggerName(uf);
    } else {
      city = await getSmallerName(uf);
    }
    list.push(uf + ' - ' + city);
  }
  let text = '';
  if (bigger) {
    text = 'Largest cities in the state: ';
  } else {
    text = 'smallest cities in the state: ';
  }

  console.log(text + JSON.stringify(list, null, 1));
}

async function getStatesWithMoreOrLessCites(more) {
  const states = JSON.parse(await fs.readFile('./files/Estados.json'));
  const listCities = [];
  for (let state of states) {
    const uf = state.Sigla;
    const cities = await getCitesCount(state.Sigla);
    listCities.push({ uf, cities });
  }
  listCities.sort((a, b) => {
    return b.cities - a.cities;
  });
  const totalFive = [];
  if (more) {
    listCities
      .slice(0, 5)
      .forEach((item) => totalFive.push(item.uf + ' - ' + item.cities));
    console.log('Five states with more cities: ' + totalFive);
  } else {
    listCities
      .slice(-5)
      .forEach((item) => totalFive.push(item.uf + ' - ' + item.cities));
    console.log('Five states with less cities: ' + totalFive);
  }
}

async function createFiles() {
  let data = await fs.readFile('./files/Estados.json');
  const states = JSON.parse(data);

  data = await fs.readFile('./files/Cidades.json');
  const cities = JSON.parse(data);

  for (let state of states) {
    const stateCities = cities.filter((city) => city.Estado === state.ID);
    await fs.writeFile(
      `./states/${state.Sigla}.json`,
      JSON.stringify(stateCities, null, 1)
    );
  }
}
