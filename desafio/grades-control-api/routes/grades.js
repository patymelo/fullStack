import { Router, json } from 'express';
import { promises as fs, write } from 'fs';
const router = Router();
router.use(json());
const { readFile, writeFile } = fs;

//Create new grade
router.post('/', async (req, res, next) => {
  try {
    let grade = req.body;
    if (
      !grade.student ||
      !grade.subject ||
      !grade.type ||
      grade.value == null
    ) {
      throw new Error('Student, subject, type and value are required.');
    }
    const dataGrade = JSON.parse(await readFile(global.fileName));
    grade = {
      id: dataGrade.nextId++,
      student: grade.student,
      subject: grade.subject,
      type: grade.type,
      value: grade.value,
      timestamp: new Date(),
    };
    dataGrade.grades.push(grade);

    await writeFile(global.fileName, JSON.stringify(dataGrade, null, 1));

    res.send(grade);
    logger.info(`POST /grade - ${JSON.stringify(grade)}`);
    res.end();
  } catch (err) {
    next(err);
  }
});

//Update grade
router.put('/', async (req, res, next) => {
  try {
    let grade = req.body;

    const dataGrade = JSON.parse(await readFile(global.fileName));
    const index = dataGrade.grades.findIndex((a) => a.id === grade.id);

    if (index === -1) {
      throw new Error('Registro not found');
    }
    if (
      !grade.student ||
      !grade.subject ||
      !grade.type ||
      grade.value == null
    ) {
      throw new Error('Student, subject, type and value are required.');
    }
    dataGrade.grades[index].student = grade.student;
    dataGrade.grades[index].subject = grade.subject;
    dataGrade.grades[index].type = grade.type;
    dataGrade.grades[index].value = grade.value;

    await writeFile(global.fileName, JSON.stringify(dataGrade, null, 2));

    res.status(200).send(grade);
    logger.info(`PUT /grade - ${JSON.stringify(grade)}`);
    res.end();
  } catch (err) {
    next(err);
  }
});

//delete grade
router.delete('/:id', async (req, res, next) => {
  try {
    const id = parseInt(req.params.id);
    const dataGrade = JSON.parse(await readFile(global.fileName));
    dataGrade.grades = dataGrade.grades.filter((ac) => ac.id != parseInt(id));
    await writeFile(global.fileName, JSON.stringify(dataGrade, null, 1));
    logger.info(`DELETE /grade/:id - ${id}`);
    res.end();
  } catch (err) {
    next(err);
  }
});

//busca grade for id
router.get('/:id', async (req, res, next) => {
  try {
    const id = parseInt(req.params.id);
    const dataGrade = JSON.parse(await readFile(global.fileName));
    const index = dataGrade.grades.findIndex((a) => a.id === id);
    if (index === -1) {
      throw new Error('Registro not found');
    }
    dataGrade.grades = dataGrade.grades.filter((ac) => ac.id === parseInt(id));
    logger.info(`GET /grade/:id - ${id}`);
    res.send(dataGrade.grades);
    res.end();
  } catch (err) {
    next(err);
  }
});

//busca nota total por studante e disciplina
router.get('/nota/:student/:subject', async (req, res, next) => {
  try {
    const student = req.params.student;
    const subject = req.params.subject;
    const dataGrade = JSON.parse(await readFile(global.fileName));

    const totalGrade = dataGrade.grades
      .filter((gr) => gr.student === student && gr.subject === subject)
      .reduce((sum, record) => {
        return sum + record.value;
      }, 0);

    const grade = {
      id: dataGrade.id,
      student: student,
      subject: subject,
      totalGrade: totalGrade,
    };

    logger.info(`GET /grade/nota/:student/:subject - ${student}/${subject}`);
    res.send(grade);
    res.end();
  } catch (err) {
    next(err);
  }
});

//busca media total por disciplina
router.get('/media/:subject/:type', async (req, res, next) => {
  try {
    const subject = req.params.subject;
    const type = req.params.type;

    const dataGrade = JSON.parse(await readFile(global.fileName));

    const totalSubject = dataGrade.grades.filter(
      (gr) => gr.subject === subject && gr.type === type
    ).length;
    const totalGrade = dataGrade.grades
      .filter((gr) => gr.subject === subject && gr.type === type)
      .reduce((sum, record) => {
        return sum + record.value;
      }, 0);
    const mediaGrade = totalGrade / totalSubject;
    const grade = {
      subject: subject,
      type: type,
      mediaGrade: mediaGrade,
    };

    logger.info(`GET /grade/media/:subject/:type - ${subject}/${type}`);
    res.send(grade);
    res.end();
  } catch (err) {
    next(err);
  }
});

//tratamento de erro
router.use((err, req, res, next) => {
  global.logger.error(`${err.message}`);
  res.status(400).send({ error: err.message });
});

//busca tres melhores grades
router.get('/bestTree/:subject/:type', async (req, res, next) => {
  try {
    const subject = req.params.subject;
    const type = req.params.type;

    const dataGrade = JSON.parse(await readFile(global.fileName));

    dataGrade.grades = dataGrade.grades
      .filter((gr) => gr.subject === subject && gr.type === type)
      .sort((a, b) => b.value - a.value)
      .slice(0, 3);

    console.log(dataGrade.grades);

    logger.info(`GET /grade/bestTree/:subject/:type `);
    res.send(dataGrade.grades);
    res.end();
  } catch (err) {
    next(err);
  }
});
export default router;
