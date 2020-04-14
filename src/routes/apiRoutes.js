import express from 'express';
import fs from 'fs';
import path from 'path';
import * as logger from 'morgan';
import {
  validationMiddleware,
  estimateDataInJSON,
  estimateDataInXML,
  logFormatter,
  requestFromQueryMiddleware
}
  from '../utils/api.util';

const LOGS_FILE_PATH = path.join(__dirname, 'requests.log');

const router = express.Router();

router.use(logger(logFormatter, {
  skip(req, res) {
    return res.statusCode > 200;
  },
  stream: fs.createWriteStream(LOGS_FILE_PATH, { flags: 'a' })
}));

// GET / POST for XML
router.post('/xml', validationMiddleware, estimateDataInXML);
router.get('/xml',
  requestFromQueryMiddleware,
  validationMiddleware,
  estimateDataInXML);

// GET / POST for JSON
router.post(['/', '/json'], validationMiddleware, estimateDataInJSON);
router.get(['/', '/json'],
  requestFromQueryMiddleware,
  validationMiddleware,
  estimateDataInJSON);

// GET LOGS
router.get('/logs', async (req, res) => {
  fs.readFile(LOGS_FILE_PATH, 'utf8', (err, data) => {
    if (err) res.status(500).send('Server internal error');

    res.type('txt');
    res.status(200).send(data);
  });
});

export default router;
