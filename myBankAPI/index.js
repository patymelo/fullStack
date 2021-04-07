import express from 'express';
import winston from 'winston';
import swaggerUi from 'swagger-ui-express';
import cors from 'cors';
import accountsRouter from './routes/accounts.js';
import { promises as fs } from 'fs';
import { swaggerDocument } from './doc.js';

const { readFile, writeFile } = fs;
const app = express();
app.use(express.static('public'));
app.use(cors());
app.use('/doc', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.use('/account', accountsRouter);

const { combine, timestamp, label, printf } = winston.format;
const myFormat = printf(({ level, message, label, timestamp }) => {
  return `${timestamp} [${label}] ${level}: ${message}`;
});
global.logger = winston.createLogger({
  level: 'silly',
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: 'myBankApi.log' }),
  ],
  format: combine(label({ label: 'myBankApi' }), timestamp(), myFormat),
});
global.fileName = 'accounts.json';

app.listen(3000, async () => {
  try {
    await readFile(global.fileName);
    logger.info('API Started!');
  } catch (err) {
    console.log('entrou');
    const initalJson = {
      nextId: 1,
      accounts: [],
    };
    writeFile(global.fileName, JSON.stringify(initalJson))
      .then(() => {
        logger.info('API started and file created!');
      })
      .catch((err) => {
        logger.error();
        err;
      });
  }
});
