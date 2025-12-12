// Seasonal logic for Lithuania (EET/EEST timezone)
// Winter: Dec-Feb, Spring: Mar-May, Summer: Jun-Aug, Fall: Sep-Nov

export const getCurrentSeason = () => {
  const now = new Date();
  const month = now.getMonth() + 1; // getMonth() returns 0-11
  
  if (month >= 12 || month <= 2) {
    return 'winter';
  } else if (month >= 3 && month <= 5) {
    return 'spring';
  } else if (month >= 6 && month <= 8) {
    return 'summer';
  } else {
    return 'fall';
  }
};

export const getSeasonalMultiplier = (plant, season = null) => {
  const currentSeason = season || getCurrentSeason();
  return plant.seasonalAdjustments[currentSeason] || 1.0;
};

export const getAdjustedWateringDays = (plant, season = null) => {
  const multiplier = getSeasonalMultiplier(plant, season);
  return Math.round(plant.baseWateringDays * multiplier);
};

