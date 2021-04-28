import express from 'express';
import * as controller from '../controllers/accountController.js';
const app = express();

app.get('/', controller.findAll);
app.patch('/account/deposit/', controller.deposit);
app.patch('/account/withdraw/', controller.withdraw);
app.get('/account/checkBalance/:agencia/:conta', controller.checkBalance);
app.delete('/account/remove/', controller.remove);
app.patch('/account/transfer/', controller.transfer);

app.get('/account/lowestBalance/:limit', controller.lowestBalance);
app.get('/account/findID/:id', controller.findID);
app.get('/account/findAccount/:conta', controller.findAccount);
app.get('/account/highestBalance/:limit', controller.highestBalance);
app.get('/account/averageBalance/:agencia', controller.averageBalance);
app.patch('/account/tranferHighestBalance/', controller.tranferHighestBalance);

export { app as accountRouter };
