let tabUsers = null;
let tabStatistics = null;
let inputUser = null;
let buttonUser = null;
let titleUser = '';

let currentName = null;

let allUsers = [];
let usersFound = [];
let findUsers = [];
let countUsersFound = 0;

let countWomen = 0;
let countMen = 0;
let sumAge = 0;
let averageAge = 0;
let totalFindUsers = 0;

let inputMale = '';
let inputWomen = '';
let inputSumAge = '';
let inputAverageAge = '';
let divStatistics = '';

let numberFormat = null;

window.addEventListener('load', () => {
  tabUsers = document.querySelector('#tabUsers');
  tabStatistics = document.querySelector('#tabStatistics');
  inputUser = document.querySelector('#inputUser');
  buttonUser = document.querySelector('#buttonUser');
  titleUser = document.querySelector('#titleUser');

  numberFormat = Intl.NumberFormat('pt-BR', { maximumSignificantDigits: 4 });
  inputUser.addEventListener('keyup', fecthUserByEnter);
  buttonUser.addEventListener('click', fecthUserByButton);

  loadUsers();
});

async function loadUsers() {
  const res = await fetch('http://localhost:3001/users');
  const json = await res.json();
  allUsers = json.map((users) => {
    const { name, nameLowerCase, picture, dob, gender } = users;
    return {
      name: name.first + ' ' + name.last,
      nameLowerCase: name.first.toLowerCase() + ' ' + name.last.toLowerCase(),
      picture: picture.thumbnail,
      age: dob.age,
      gender: gender,
    };
  });
}

function fecthUserByEnter(event) {
  if (event.key === 'Enter') {
    const currentValue = inputUser.value;
    userToDescription(currentValue);
  }
}

function fecthUserByButton(event) {
  const currentValue = inputUser.value;
  userToDescription(currentValue);
}

function removeDiv() {
  let divUser = document.querySelector('#contUser');
  let divStatisc = document.querySelector('#statistics');
  if (divUser !== null) {
    tabUsers.removeChild(divUser);
    tabStatistics.removeChild(divStatisc);
  }
}

function userToDescription(nameUser) {
  if (nameUser !== currentName) {
    removeDiv();
  }
  currentName = nameUser;

  findUsers = allUsers.filter((user) =>
    user.nameLowerCase.includes(nameUser.toLowerCase())
  );
  findUsers.sort((a, b) => {
    return a.name.localeCompare(b.name);
  });
  showFindUser();
  showStatistics();
}

function showFindUser() {
  totalFindUsers = findUsers.length;
  titleUser.textContent = totalFindUsers + ' usuário(s) encontrado(s)';
  if (totalFindUsers !== 0) {
    let divContentUser = document.createElement('div');
    divContentUser.setAttribute('class', 'divContentUser');
    divContentUser.setAttribute('id', 'contUser');
    findUsers.forEach((users) => {
      const { name, picture, age } = users;
      let divUser = document.createElement('div');
      divUser.setAttribute('class', 'divUser');

      let imgUser = document.createElement('img');
      imgUser.setAttribute('src', picture);
      imgUser.setAttribute('alt', name);

      let labelUser = document.createElement('input');
      labelUser.setAttribute('class', 'textUser');
      labelUser.setAttribute('disable', 'true');
      labelUser.value = name + ', ' + age + ' anos';

      divUser.appendChild(imgUser);
      divUser.appendChild(labelUser);
      divContentUser.appendChild(divUser);
    });
    tabUsers.appendChild(divContentUser);
  }
}

function showStatistics() {
  totalFindUsers = findUsers.length;
  titleStatistic.textContent = 'Estatísticas';
  if (totalFindUsers !== 0) {
    divStatistics = document.createElement('div');
    divStatistics.setAttribute('class', 'divStatistics');
    divStatistics.setAttribute('id', 'statistics');
    createInputMen();
    createInputWomen();
    createInputSumAge();
    createInputAverageAge();
    tabStatistics.appendChild(divStatistics);
  }
}

function createInputWomen() {
  let divWomen = document.createElement('div');
  countWomen = findUsers.filter((user) => user.gender === 'female').length;
  inputWomen = document.createElement('input');
  inputWomen.setAttribute('class', 'textUser');
  inputWomen.setAttribute('disable', 'true');
  inputWomen.value = 'Sexo Feminino: ' + countWomen;
  divWomen.appendChild(inputWomen);
  divStatistics.appendChild(divWomen);
}

function createInputMen() {
  let divMen = document.createElement('div');
  countMen = findUsers.filter((user) => user.gender === 'male').length;
  inputMen = document.createElement('input');
  inputMen.setAttribute('class', 'textUser');
  inputMen.setAttribute('disable', 'true');
  inputMen.value = 'Sexo Masculino: ' + countMen;
  divMen.appendChild(inputMen);
  divStatistics.appendChild(divMen);
}

function createInputSumAge() {
  let divSumAge = document.createElement('div');
  sumAge = findUsers.reduce((acc, curr) => acc + curr.age, 0);
  inputSumAge = document.createElement('input');
  inputSumAge.setAttribute('class', 'textUser');
  inputSumAge.setAttribute('disable', 'true');
  inputSumAge.value = 'Soma das idades: ' + sumAge;
  divSumAge.appendChild(inputSumAge);
  divStatistics.appendChild(divSumAge);
}

function createInputAverageAge() {
  let divAverageAge = document.createElement('div');
  averageAge = sumAge / totalFindUsers;
  inputAverageAge = document.createElement('input');
  inputAverageAge.setAttribute('class', 'textUser');
  inputAverageAge.setAttribute('disable', 'true');
  inputAverageAge.value = 'Media das idades: ' + formatNumber(averageAge);
  divAverageAge.appendChild(inputAverageAge);
  divStatistics.appendChild(divAverageAge);
}

function formatNumber(number) {
  return numberFormat.format(number);
}
