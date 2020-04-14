import * as logger from 'morgan';
import * as json2xmlparser from 'js2xmlparser';
import covid19estimator from '../estimator';

const joi = require('@hapi/joi');

const Covid19EstimationRequestSchema = joi.object().keys({
  region: joi.object().keys({
    name: joi.string(),
    avgAge: joi.number(),
    avgDailyIncomeInUSD: joi.number().required(),
    avgDailyIncomePopulation: joi.number().min(0).max(10).required()
  }),
  periodType: joi.string().regex(/days*|weeks*|months*/i).required(),
  timeToElapse: joi.number().required(),
  reportedCases: joi.number().required(),
  population: joi.number().required(),
  totalHospitalBeds: joi.number().required()
});

export const estimateDataInXML = (req, res) => {
  // const estimatedData = covid19estimator(req.body);

  res.type('xml');
  res.status(200).send(json2xmlparser.parse('estimatedData', covid19estimator(req.body)));
};

export const estimateDataInJSON = (req, res) => {
  res.json(covid19estimator(req.body));
};

export const requestFromQueryMiddleware = (req, res, next) => {
  if (req.query) {
    req.body = req.query;
  }

  next();
};

// Validation middleware
export const validationMiddleware = (req, res, next) => {
  const { error } = Covid19EstimationRequestSchema.validate(req.body);

  if (error) {
    return res.status(422).send(error);
  }

  return next();
};

/**
 * Format log strings to have at least 2 digits
 *
 * @param m
 * @param req
 * @param res
 * @returns {string}
 */
export const logFormatter = (m, req, res) => {
  const responseTime = logger['response-time'](req, res, 0);
  let responseTimeString = `${String(responseTime)}ms`;

  if (responseTime < 10) {
    responseTimeString = `0${responseTimeString}`;
  }

  return `${m.method(req)}\t\t${m.url(req)}\t\t${m.status(req, res)}\t\t${responseTimeString}`;
};
