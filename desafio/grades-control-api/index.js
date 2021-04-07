import express from 'express';
import winston from 'winston';
import cors from 'cors';
import gradeRouter from './routes/grades.js';
import { promises as fs } from 'fs';

const { readFile, writeFile } = fs;
const app = express();
app.use(express.static('public'));
app.use(cors());
app.use('/grade', gradeRouter);

const { combine, timestamp, label, printf } = winston.format;
const myFormat = printf(({ level, message, label, timestamp }) => {
  return `${timestamp} [${label}] ${level}: ${message}`;
});
global.logger = winston.createLogger({
  level: 'silly',
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: 'gradeApi.log' }),
  ],
  format: combine(label({ label: 'gradeApi' }), timestamp(), myFormat),
});
global.fileName = 'grades.json';

app.listen(3000, async () => {
  try {
    await readFile(global.fileName);
    logger.info('API Started!');
  } catch (err) {
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
