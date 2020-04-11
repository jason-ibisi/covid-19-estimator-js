/* eslint-disable no-console */
import covid19ImpactEstimator from './estimator';
import './css/pure-min.css';
import './css/grid-min.css';
import './css/style.css';

const formElement = document.querySelector('#formInputData');
const formInputElements = document.querySelectorAll('#formInputData input, #formInputData select');
const formLastInputElements = document.querySelectorAll('#formLastInputData input, #formLastInputData select');
const tableEstimatedDataRows = document.querySelectorAll('table#tableEstimatedData tbody tr');

/* Structure the data from the data */
const structureData = (elements) => {
  const data = {
    region: {
      name: '',
      avgAge: 0,
      avgDailyIncomeInUSD: 0,
      avgDailyIncomePopulation: 0
    },
    periodType: '',
    timeToElapse: 0,
    reportedCases: 0,
    population: 0,
    totalHospitalBeds: 0
  };

  elements.forEach(({ name, value, type }) => {
    const parsedValue = type === 'number' ? Number(value) : value;
    switch (name) {
      case 'region':
        data.region.name = parsedValue;
        break;
      case 'avgDailyIncomeInUSD':
        data.region[name] = parsedValue;
        break;
      case 'avgDailyIncomePopulation':
        data.region[name] = parsedValue;
        break;
      default:
        data[name] = parsedValue;
        break;
    }
  });

  return data;
};

/* Populate the LastInputData Form with structured data */
const populateLastInputDataForm = (elements, data) => {
  elements.forEach((element) => {
    switch (element.name) {
      case 'region':
        element.value = data.region.name;
        break;
      case 'avgDailyIncomeInUSD':
        element.value = data.region.avgDailyIncomeInUSD;
        break;
      case 'avgDailyIncomePopulation':
        element.value = data.region.avgDailyIncomePopulation;
        break;
      default:
        element.value = data[element.name];
        break;
    }
  });
};

/* Populate Estimated Data Table */
const populateEstimatedDataTable = (rows, estimatedData) => {
  rows.forEach((row) => {
    const { id } = row;

    const impactDataRowElement = row.querySelector('td:nth-of-type(2)');
    const severeImpactDataRowElement = row.querySelector('td:nth-of-type(3)');

    impactDataRowElement.textContent = estimatedData.impact[id];
    severeImpactDataRowElement.textContent = estimatedData.severeImpact[id];
  });
};

const handleSubmit = (event) => {
  event.preventDefault();

  const structuredData = structureData(formInputElements);

  populateLastInputDataForm(formLastInputElements, structuredData);

  const estimatedData = covid19ImpactEstimator(structuredData);

  populateEstimatedDataTable(tableEstimatedDataRows, estimatedData);

  event.target.reset();
};

/* add an event listener to the submit button */
formElement.addEventListener('submit', handleSubmit);

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker
      .register('/service-worker.js')
      .then((r) => r)
      .catch((e) => e);
  });
}
