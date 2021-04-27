//import { db } from '../models/index.js';
import { accountModel } from '../models/accountModel.js';
//const Account = db.account;

export const findAll = async (req, res) => {
  try {
    const account = await accountModel.find({});
    res.send(account);
  } catch (err) {
    res.status(500).send(err);
  }
};

export const findID = async (req, res) => {
  const id = req.params.id;
  try {
    const account = await accountModel.find({ _id: id });
    res.send(account);
  } catch (err) {
    res.status(500).send(err);
  }
};

export const deposit = async (req, res) => {
  const account = req.body;
  try {
    let newDeposit = await validateAccount(account);
    newDeposit.balance += account.balance;
    newDeposit = new accountModel(newDeposit);
    await newDeposit.save();
    res.send(newDeposit);
  } catch (err) {
    res.status(500).send(err);
  }
};

const chargeAmount = async (account, balance) => {
  try {
    let accountWithdraw = await validateAccount(account);
    if (accountWithdraw.balance < balance) {
      throw Error('Saldo insuficiente em conta para o saque informado!');
    } else {
      accountWithdraw.balance -= balance;
      accountWithdraw = new accountModel(accountWithdraw);
      await accountWithdraw.save();
      return accountWithdraw;
    }
  } catch (err) {
    return err;
  }
};

export const withdraw = async (req, res) => {
  const account = req.body;
  try {
    const allWithdraw = parseInt(account.withdraw + 1);
    const accountWithdraw = await chargeAmount(account, allWithdraw);
    res.send(accountWithdraw);
  } catch (err) {
    res.status(500).send(err);
  }
};

export const transfer = async (req, res) => {
  const account = req.body;
  let saldo = 0;
  try {
    const { origin, destiny, withdraw } = account;
    let accountOrigin = await accountModel.findOne({ conta: origin });
    let accountDestiny = await accountModel
      .findOne({ conta: destiny })
      .map((des) => {
        const { agencia, balance } = des;
        return {
          agDestino: agencia,
        };
      });

    let { agencia } = accountOrigin;
    let { agDestino } = accountDestiny;

    accountDestiny.balance += withdraw;
    accountDestiny = new accountModel(accountDestiny);
    //await accountDestiny.save();

    if (agencia == agDestino) {
      console.log(withdraw);
      saldo = await chargeAmount(accountOrigin, withdraw);
    } else {
      const taxa = parseInt(8 + withdraw);
      saldo = await chargeAmount(accountOrigin, taxa);
    }
    const { balance } = saldo;
    res.send({ saldo: balance });
  } catch (err) {
    res.status(500).send(err);
  }
};

export const checkBalance = async (req, res) => {
  const agencia = req.params.agencia;
  const conta = req.params.conta;
  const account = {
    agencia: agencia,
    conta: conta,
  };
  try {
    const accountBalance = await validateAccount(account);
    const { agencia, conta, name, balance } = accountBalance;
    const saldo = { saldo: balance };
    res.send(saldo);
  } catch (err) {
    res.status(500).send(err);
  }
};

export const remove = async (req, res) => {
  const account = req.body;
  try {
    let accountRemove = await validateAccount(account);
    const { agencia, conta } = accountRemove;
    accountRemove = await accountModel.deleteOne({
      agencia: agencia,
      conta: conta,
    });
    const accountFindAgencia = await accountModel.find({ agencia: agencia });
    res.send({ totalAgencias: accountFindAgencia.length });
    res.send();
  } catch (err) {
    res.status(500).send(err);
  }
};

export const lowestBalance = async (req, res) => {
  const limit = parseInt(req.params.limit);
  try {
    const projection_doc = { agencia: 1, conta: 1, balance: 1, _id: 0 };

    const findLowestBalance = await accountModel
      .find({}, projection_doc)
      .sort({ balance: 1 })
      .limit(limit);
    res.send(findLowestBalance);
  } catch (err) {
    res.status(500).send(err);
  }
};

export const highestBalance = async (req, res) => {
  const limit = parseInt(req.params.limit);
  try {
    const projection_doc = {
      agencia: 1,
      conta: 1,
      name: 1,
      balance: 1,
      _id: 0,
    };

    const findHighestBalance = await accountModel
      .find({}, projection_doc)
      .sort({ balance: -1, name: 1 })
      .limit(limit);
    res.send(findHighestBalance);
  } catch (err) {
    res.status(500).send(err);
  }
};

export const averageBalance = async (req, res) => {
  const agenciaId = parseInt(req.params.agencia);
  try {
    const averageBalance = await accountModel.aggregate([
      {
        $match: {
          agencia: agenciaId,
        },
      },
      {
        $group: {
          _id: '$agencia',
          media: {
            $avg: '$balance',
          },
        },
      },
      {
        $project: {
          _id: 0,
          media: 1,
        },
      },
    ]);
    res.send(averageBalance);
  } catch (err) {
    res.status(500).send(err);
  }
};
export const validateAccount = async (account) => {
  const { agencia, conta } = account;
  account = { agencia, conta };
  try {
    if (typeof account.agencia !== 'undefined') {
      account = await accountModel.findOne(account);
    } else {
      account = await accountModel.findOne({ conta: account.conta });
    }
    if (!account) {
      throw Error(`(${agencia}/${conta}) agencia/conta invalida`);
    }
    return account;
  } catch (err) {
    return Error(`(${agencia}/${conta}) agencia/conta invalida`);
  }
};

export const tranferHighestBalance = async (req, res) => {
  try {
    const agenciaPrivate = 99;

    const bigBalanceAccount = await accountModel.aggregate([
      {
        $sort: {
          balance: -1,
        },
      },
      {
        $group: {
          _id: '$agencia',
          name: {
            $first: '$agencia',
          },
          agencia: {
            $first: '$agencia',
          },
          conta: {
            $first: '$conta',
          },
          name: {
            $first: '$name',
          },
          balance: {
            $first: '$balance',
          },
        },
      },
      {
        $project: {
          _id: 0,
          name: 1,
          agencia: 1,
          conta: 1,
          balance: 1,
        },
      },
    ]);
    bigBalanceAccount.forEach(function (account) {
      account.agencia = agenciaPrivate;
      console.log(account);
      accountModel.updateOne(accountModel, { new: true });
    });
    const projection_doc = { agencia: 1, name: 1, balance: 1, _id: 0 };
    const accountPrivate = await accountModel.find(
      { agencia: agenciaPrivate },
      projection_doc
    );
    res.send(accountPrivate);
    res.send();
  } catch (err) {
    res.status(500).send(err);
  }
};
