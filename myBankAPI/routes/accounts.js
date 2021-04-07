import { Router, json } from 'express';
import { promises as fs, write } from 'fs';

const router = Router();
router.use(json());
const { readFile, writeFile } = fs;

//Atualiza todo account
router.put('/', async (req, res, next) => {
  try {
    let account = req.body;

    const dataAccount = JSON.parse(await readFile(global.fileName));
    const index = dataAccount.accounts.findIndex((a) => a.id === account.id);

    if (index === -1) {
      throw new Error('Registro not found');
    }
    if (!account.name || account.balance == null) {
      throw new Error('Name and balance are required.');
    }
    dataAccount.accounts[index].name = account.name;
    dataAccount.accounts[index].balance = account.balance;

    await writeFile(global.fileName, JSON.stringify(dataAccount, null, 1));

    res.status(200).send(account);
    res.end();
  } catch (err) {
    next(err);
  }
});

//Atualiza parte account
router.patch('/updateBalance', async (req, res, next) => {
  try {
    let account = req.body;

    const dataAccount = JSON.parse(await readFile(global.fileName));
    const index = dataAccount.accounts.findIndex((a) => a.id === account.id);

    if (!account.id || account.balance == null) {
      throw new Error('ID and balance are required.');
    }
    dataAccount.accounts[index].balance = account.balance;

    await writeFile(global.fileName, JSON.stringify(dataAccount, null, 1));

    res.status(200).send(dataAccount.accounts[index]);
    logger.info(`PATCH /account/updateBalance - ${JSON.stringify(account)}`);
    res.end();
  } catch (err) {
    next(err);
  }
});

//Inserir novo account
router.post('/', async (req, res, next) => {
  try {
    let account = req.body;
    if (!account.name || account.balance == null) {
      throw new Error('Name and balance are required.');
    }
    const dataAccount = JSON.parse(await readFile(global.fileName));

    account = {
      id: dataAccount.nextId++,
      name: account.name,
      balance: account.balance,
    };
    dataAccount.accounts.push(account);

    await writeFile('accounts.json', JSON.stringify(dataAccount, null, 1));

    res.send(account);
    logger.info(`POST /account - ${JSON.stringify(account)}`);
    res.end();
  } catch (err) {
    next(err);
  }
});

//Listar tudo
router.get('/', async (req, res, next) => {
  try {
    const dataAccount = JSON.parse(await readFile(global.fileName));
    delete dataAccount.nextId;
    res.send(dataAccount);
    logger.info(`GET /account`);
  } catch (err) {
    next(err);
  }
});

//Buscar por id
router.get('/:id', async (req, res, next) => {
  try {
    const id = req.params.id;
    const dataAccount = JSON.parse(await readFile(global.fileName));
    delete dataAccount.nextId;

    const account = dataAccount.accounts.find((ac) => ac.id === parseInt(id));
    res.send(account);
    logger.info(`GET /account/:id - ${JSON.stringify(account)}`);
    res.end();
  } catch (err) {
    next(err);
  }
});

//delete por id
router.delete('/:id', async (req, res, next) => {
  try {
    const id = parseInt(req.params.id);
    const dataAccount = JSON.parse(await readFile(global.fileName));
    dataAccount.accounts = dataAccount.accounts.filter(
      (ac) => ac.id != parseInt(id)
    );
    await writeFile(global.fileName, JSON.stringify(dataAccount, null, 1));
    res.end();
    logger.info(`DELETE /account/:id - ${id}`);
  } catch (err) {
    next(err);
  }
});
//tratamento de erro
router.use((err, req, res, next) => {
  global.logger.error(`${err.message}`);
  res.status(400).send({ error: err.message });
});

export default router;
