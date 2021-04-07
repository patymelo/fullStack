const wallets = await Wallet.findAll({
  where: {},
  attributes: [
    'id',
    'name',
    'wallet_type',
    'icon',
    'color',
    'credit_limit',
    'due_day',
  ],
  order: [['name', 'ASC']],
});

const finalObject = [];

wallets.forEach(async (wallet) => {
  const currentItem = wallet.dataValues;
  const { id } = await currentItem;
  const { sum_credits } = await WalletsResume.sumCredits(id);
  const { sum_debits } = await WalletsResume.sumDebits(id);
  const sum_account_value = (sum_credits - sum_debits).toFixed(2);
  currentItem.account_value = sum_account_value;
  finalObject.push(currentItem);
  console.log(`pushed ${id}`);
});

console.log(`-------------------------`);
console.log(finalObject);
//return res.json(finalObject);
