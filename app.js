/*Imports*/
import express from 'express';
import mongoose from 'mongoose';
import { accountRouter } from './routes/accountRouter.js';

const uri =
  'mongodb+srv://bootcmapo:admin@cluster0.t1pxw.mongodb.net/grades?retryWrites=true&w=majority';

//Conectando com o MongoDB
(async () => {
  try {
    console.log('Conectando ao MongoDB...');
    await mongoose.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('Conectado com sucesso ao MongoDB');
  } catch (error) {
    console.log('Erro ao conectar ao MongoDB,' + error);
  }
})();

const app = express();
app.listen(3000, () => console.log('API Started!'));

app.use(express.json());
app.use(accountRouter);
