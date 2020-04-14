import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import apiEndPoints from './routes/apiRoutes';

const app = express();

app.use(cors());

app.use(bodyParser.json());

app.use('/api/v1/on-covid-19', apiEndPoints);

app.use((req, res) => {
  res.status(404).send('Resource not found.');
});

app.use((err, req, res) => {
  if (res.headersSent) {
    return;
  }

  res.status(err.status || 500);
  res.send(err.message || 'Internal Server Error');
});

app.listen(process.env.PORT || 3001, () => {
  // eslint-disable-next-line no-console
  console.log('Server started and running .....');
});
