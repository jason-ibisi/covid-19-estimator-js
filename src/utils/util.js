const getTimeToElapseInDays = (periodType, timeToElapse) => {
  let timeToElapseInDays = timeToElapse;

  if (periodType.toLowerCase() === 'weeks') {
    timeToElapseInDays = timeToElapse * 7;
  } else if (periodType.toLowerCase() === 'months') {
    timeToElapseInDays = timeToElapse * 30;
  }

  return timeToElapseInDays;
};

const getCurrentlyInfected = (reportedCases, impactType) => {
  const multiplier = impactType === 'impact' ? 10 : 50;
  const currentlyInfected = reportedCases * multiplier;

  return currentlyInfected;
};

const getInfectionsByRequestedTime = (currentlyInfected, timeToElapseInDays) => {
  const factor = 2 ** Math.floor(timeToElapseInDays / 3);

  const infectionsByRequestedTime = currentlyInfected * factor;

  return infectionsByRequestedTime;
};

const getSevereCasesByRequestedTime = (infectionsByRequestedTime) => {
  const severeCasesByRequestedTime = Math.trunc(infectionsByRequestedTime * 0.15);
  return severeCasesByRequestedTime;
};

const getHospitalBedsByRequestedTime = (totalHospitalBeds, severeCasesByRequestedTime) => {
  const availableBeds = totalHospitalBeds * 0.35;
  const hospitalBedsByRequestedTime = Math.trunc(availableBeds - severeCasesByRequestedTime);
  return hospitalBedsByRequestedTime;
};

const getCasesForICUByRequestedTime = (infectionsByRequestedTime) => {
  const casesForICUByRequestedTime = Math.trunc(infectionsByRequestedTime * 0.05);
  return casesForICUByRequestedTime;
};

const getCasesForVentilatorsByRequestedTime = (infectionsByRequestedTime) => {
  const casesForVentilatorsByRequestedTime = Math.trunc(infectionsByRequestedTime * 0.02);
  return casesForVentilatorsByRequestedTime;
};

const getDollarsInFlight = (
  infectionsByRequestedTime, avgDailyIncomePopulation,
  avgDailyIncomeInUSD, timeToElapseInDays
) => {
  const dollarsInFlight = Math.trunc((infectionsByRequestedTime * avgDailyIncomePopulation * avgDailyIncomeInUSD) / timeToElapseInDays);
  return dollarsInFlight;
};

const getImpactData = (data, impactType) => {
  const {
    region: {
      avgDailyIncomePopulation,
      avgDailyIncomeInUSD
    },
    periodType,
    timeToElapse,
    reportedCases,
    totalHospitalBeds
  } = data;

  const timeToElapseInDays = getTimeToElapseInDays(periodType, timeToElapse);
  const currentlyInfected = getCurrentlyInfected(reportedCases, impactType);
  const infectionsByRequestedTime = getInfectionsByRequestedTime(currentlyInfected, timeToElapseInDays);
  const severeCasesByRequestedTime = getSevereCasesByRequestedTime(infectionsByRequestedTime);
  const hospitalBedsByRequestedTime = getHospitalBedsByRequestedTime(totalHospitalBeds, severeCasesByRequestedTime);
  const casesForICUByRequestedTime = getCasesForICUByRequestedTime(infectionsByRequestedTime);
  const casesForVentilatorsByRequestedTime = getCasesForVentilatorsByRequestedTime(infectionsByRequestedTime);
  const dollarsInFlight = getDollarsInFlight(infectionsByRequestedTime, avgDailyIncomePopulation, avgDailyIncomeInUSD, timeToElapseInDays);

  return {
    currentlyInfected,
    infectionsByRequestedTime,
    severeCasesByRequestedTime,
    hospitalBedsByRequestedTime,
    casesForICUByRequestedTime,
    casesForVentilatorsByRequestedTime,
    dollarsInFlight
  };
};

export default getImpactData;
