// Plant data with watering schedules and care information
export const PLANTS = [
  {
    id: 'cayenne-pepper',
    name: 'Cayenne Pepper',
    emoji: '🌶️',
    baseWateringDays: 10, // Every 1-2 weeks (average 10 days)
    seasonalAdjustments: {
      // No major seasonal adjustments for cayenne pepper
      winter: 1.0,
      spring: 1.0,
      summer: 1.0,
      fall: 1.0
    },
    careTips: [
      'Keep soil consistently moist but not waterlogged',
      'Water when top inch of soil feels dry',
      'Requires full sun (6-8 hours daily)',
      'Thrives in warm temperatures (21-29°C)',
      'Use well-draining soil with drainage holes'
    ],
    color: '#FF6B6B'
  },
  {
    id: 'cayenne-pepper-offsprings',
    name: 'Cayenne Pepper Offsprings',
    emoji: '🌱',
    baseWateringDays: 10, // Similar to mature plant
    seasonalAdjustments: {
      winter: 1.0,
      spring: 1.0,
      summer: 1.0,
      fall: 1.0
    },
    careTips: [
      'Keep soil consistently moist but not waterlogged',
      'Monitor soil moisture more closely as seedlings are sensitive',
      'Ensure ample sunlight, gradually increasing exposure',
      'Keep in warm conditions (avoid below 16°C)',
      'Transplant to larger pots as they grow'
    ],
    color: '#4ECDC4'
  },
  {
    id: 'cyclamen',
    name: 'Cyclamen',
    emoji: '🌸',
    baseWateringDays: 10, // Every 1-2 weeks during active growth
    seasonalAdjustments: {
      winter: 1.0, // Active growth period
      spring: 1.0, // Active growth period
      summer: 0.3, // Dormancy - reduce watering significantly
      fall: 1.0 // Active growth period
    },
    careTips: [
      'Water when top inch of soil feels dry',
      'During active growth (fall-spring), keep soil moist',
      'Reduce watering during summer dormancy',
      'Water from bottom to prevent crown rot',
      'Prefers bright, indirect light',
      'Cool temperatures (15-21°C) are ideal'
    ],
    color: '#FFB6C1'
  },
  {
    id: 'kalanchoe',
    name: 'Kalanchoe',
    emoji: '🌺',
    baseWateringDays: 10, // Every 7-14 days (average 10 days)
    seasonalAdjustments: {
      winter: 1.5, // Reduce frequency in winter (every 2-3 weeks)
      spring: 1.0,
      summer: 1.0,
      fall: 1.0
    },
    careTips: [
      'Allow top inch of soil to dry between waterings',
      'Water thoroughly but infrequently',
      'Reduce watering in winter (every 2-3 weeks)',
      'Prefers bright, indirect light with some direct sun',
      'Tolerates dry air well',
      'Use well-draining cactus or succulent mix'
    ],
    color: '#FFA07A'
  },
  {
    id: 'cactus',
    name: 'Cactus',
    emoji: '🌵',
    baseWateringDays: 21, // Every 2-4 weeks (average 3 weeks)
    seasonalAdjustments: {
      winter: 1.5, // Even less frequent in winter
      spring: 1.0,
      summer: 0.8, // Slightly more frequent in summer
      fall: 1.0
    },
    careTips: [
      'Water when soil is completely dry',
      'Water thoroughly but infrequently',
      'Reduce to once a month or less in winter',
      'Requires plenty of direct sunlight (6+ hours daily)',
      'Prefers low humidity',
      'Use cactus-specific potting mix'
    ],
    color: '#90EE90'
  }
];

export const getPlantById = (id) => {
  return PLANTS.find(plant => plant.id === id);
};

