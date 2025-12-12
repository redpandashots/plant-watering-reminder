// Plant research utility - can be enhanced with web search API

export const researchPlantInfo = async (plantName) => {
  const lowerName = plantName.toLowerCase().trim();
  
  // Default values
  let emoji = '🌿';
  let baseWateringDays = 10;
  let seasonalAdjustments = {
    winter: 1.0,
    spring: 1.0,
    summer: 1.0,
    fall: 1.0
  };
  let careTips = [
    'Water when top inch of soil feels dry',
    'Provide bright, indirect light',
    'Monitor soil moisture regularly',
    'Adjust watering based on season and environment'
  ];
  let color = '#FF6B6B';

  // Categorize based on common plant types
  if (lowerName.includes('cactus') || lowerName.includes('succulent') || lowerName.includes('aloe')) {
    emoji = '🌵';
    baseWateringDays = 21;
    seasonalAdjustments = { winter: 1.5, spring: 1.0, summer: 0.8, fall: 1.0 };
    careTips = [
      'Water when soil is completely dry',
      'Water thoroughly but infrequently',
      'Reduce watering significantly in winter (once a month or less)',
      'Requires plenty of direct sunlight (6+ hours daily)',
      'Use well-draining cactus or succulent mix',
      'Prefers low humidity'
    ];
    color = '#90EE90';
  } else if (lowerName.includes('fern') || lowerName.includes('maidenhair') || lowerName.includes('boston')) {
    emoji = '🌿';
    baseWateringDays = 7;
    seasonalAdjustments = { winter: 0.8, spring: 1.0, summer: 1.2, fall: 1.0 };
    careTips = [
      'Keep soil consistently moist but not waterlogged',
      'Prefers high humidity - mist leaves regularly',
      'Water when top inch feels dry',
      'Avoid direct sunlight - prefers bright, indirect light',
      'Reduce watering slightly in winter',
      'Use well-draining soil'
    ];
    color = '#4ECDC4';
  } else if (lowerName.includes('monstera') || lowerName.includes('philodendron') || lowerName.includes('pothos')) {
    emoji = '🌿';
    baseWateringDays = 10;
    seasonalAdjustments = { winter: 0.8, spring: 1.0, summer: 1.0, fall: 1.0 };
    careTips = [
      'Water when top 2 inches of soil are dry',
      'Prefers bright, indirect light',
      'Keep soil moist but not soggy',
      'Reduce watering in winter',
      'High humidity preferred but tolerates normal levels',
      'Use well-draining potting mix'
    ];
    color = '#90EE90';
  } else if (lowerName.includes('snake') || lowerName.includes('sansevieria')) {
    emoji = '🌿';
    baseWateringDays = 14;
    seasonalAdjustments = { winter: 1.5, spring: 1.0, summer: 1.0, fall: 1.0 };
    careTips = [
      'Water when soil is completely dry',
      'Very drought tolerant - overwatering is the main issue',
      'Reduce watering significantly in winter (every 3-4 weeks)',
      'Prefers bright, indirect light but tolerates low light',
      'Use well-draining soil',
      'Allow soil to dry completely between waterings'
    ];
    color = '#90EE90';
  } else if (lowerName.includes('spider') || lowerName.includes('chlorophytum')) {
    emoji = '🕷️';
    baseWateringDays = 7;
    seasonalAdjustments = { winter: 0.8, spring: 1.0, summer: 1.0, fall: 1.0 };
    careTips = [
      'Water when top inch of soil feels dry',
      'Keep soil consistently moist',
      'Reduce watering in winter',
      'Prefers bright, indirect light',
      'Tolerates some direct sun',
      'Use well-draining soil'
    ];
    color = '#4ECDC4';
  } else if (lowerName.includes('rubber') || lowerName.includes('ficus')) {
    emoji = '🌿';
    baseWateringDays = 10;
    seasonalAdjustments = { winter: 0.8, spring: 1.0, summer: 1.0, fall: 1.0 };
    careTips = [
      'Water when top inch of soil feels dry',
      'Prefers bright, indirect light',
      'Keep soil moist but not waterlogged',
      'Reduce watering in winter',
      'Wipe leaves regularly to remove dust',
      'Prefers consistent temperature'
    ];
    color = '#90EE90';
  } else if (lowerName.includes('peace') || lowerName.includes('spathiphyllum')) {
    emoji = '🤍';
    baseWateringDays = 7;
    seasonalAdjustments = { winter: 0.8, spring: 1.0, summer: 1.0, fall: 1.0 };
    careTips = [
      'Keep soil consistently moist',
      'Water when top inch feels dry',
      'Prefers bright, indirect light',
      'High humidity preferred',
      'Reduce watering in winter',
      'Yellow leaves may indicate overwatering'
    ];
    color = '#FFB6C1';
  } else if (lowerName.includes('zz') || lowerName.includes('zamioculcas')) {
    emoji = '🌿';
    baseWateringDays = 14;
    seasonalAdjustments = { winter: 1.5, spring: 1.0, summer: 1.0, fall: 1.0 };
    careTips = [
      'Water when soil is completely dry',
      'Very drought tolerant',
      'Reduce watering significantly in winter',
      'Prefers bright, indirect light but tolerates low light',
      'Overwatering causes root rot',
      'Allow soil to dry completely between waterings'
    ];
    color = '#90EE90';
  } else if (lowerName.includes('pepper') || lowerName.includes('chili') || lowerName.includes('capsicum')) {
    emoji = '🌶️';
    baseWateringDays = 10;
    seasonalAdjustments = { winter: 1.0, spring: 1.0, summer: 1.0, fall: 1.0 };
    careTips = [
      'Keep soil consistently moist but not waterlogged',
      'Water when top inch of soil feels dry',
      'Requires full sun (6-8 hours daily)',
      'Thrives in warm temperatures (21-29°C)',
      'Use well-draining soil with drainage holes',
      'Fertilize during growing season'
    ];
    color = '#FF6B6B';
  } else if (lowerName.includes('tomato')) {
    emoji = '🍅';
    baseWateringDays = 7;
    seasonalAdjustments = { winter: 1.0, spring: 1.0, summer: 1.2, fall: 1.0 };
    careTips = [
      'Keep soil consistently moist',
      'Water deeply and regularly',
      'Requires full sun (6-8 hours daily)',
      'Water at base to avoid leaf diseases',
      'Increase watering during fruiting',
      'Use well-draining soil'
    ];
    color = '#FF6B6B';
  } else if (lowerName.includes('basil') || lowerName.includes('herb')) {
    emoji = '🌿';
    baseWateringDays = 5;
    seasonalAdjustments = { winter: 0.8, spring: 1.0, summer: 1.2, fall: 1.0 };
    careTips = [
      'Keep soil consistently moist',
      'Water when top inch feels dry',
      'Prefers full sun to partial shade',
      'Water more frequently in summer',
      'Pinch flowers to encourage leaf growth',
      'Use well-draining soil'
    ];
    color = '#90EE90';
  }

  return {
    name: plantName.trim(),
    emoji: emoji,
    baseWateringDays: baseWateringDays,
    seasonalAdjustments: seasonalAdjustments,
    careTips: careTips,
    color: color
  };
};

