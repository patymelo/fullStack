/*Imports*/
import express from 'express';
import mongoose from 'mongoose';
import { accountRouter } from './routes/accountRouter.js';

import dotenv from 'dotenv';
dotenv.config();

const usrDB = process.env.USRDB;
const pwb = process.env.PWDDB;
const port = process.env.PORT || process.env.PORTADB || 3000;

const uri = `mongodb+srv://${usrDB}:${pwb}@cluster0.t1pxw.mongodb.net/grades?retryWrites=true&w=majority`;

//Conectando com o MongoDB
(async () => {
  try {
    console.log('Conectando ao MongoDB...');
    await mongoose.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('Conectado com sucesso ao MongoDB Atlas');
  } catch (error) {
    console.log('Erro ao conectar ao MongoDB,' + error);
  }
})();

const app = express();
app.listen(port, '0.0.0.0');

app.use(express.json());
app.use(accountRouter);
