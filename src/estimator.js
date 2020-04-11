import getImpactData from './utils/util';

const covid19ImpactEstimator = (data) => {
  const estimatedData = {
    data: { ...data },
    impact: { ...getImpactData(data, 'impact') },
    severeImpact: { ...getImpactData(data, 'severe') }
  };

  return estimatedData;
};

export default covid19ImpactEstimator;
