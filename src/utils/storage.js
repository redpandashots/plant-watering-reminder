// localStorage utilities for watering history
import { formatDate } from './dateHelpers';

const STORAGE_KEY = 'plant_watering_history';
const NOTIFICATION_KEY = 'plant_notification_preferences';
const CUSTOM_PLANTS_KEY = 'custom_plants';

export const getWateringHistory = () => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : {};
  } catch (error) {
    console.error('Error reading watering history:', error);
    return {};
  }
};

export const saveWateringHistory = (history) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
  } catch (error) {
    console.error('Error saving watering history:', error);
  }
};

export const markPlantAsWatered = (plantId, date = new Date()) => {
  const history = getWateringHistory();
  // Use formatDate helper which respects local timezone instead of UTC
  const dateStr = formatDate(date);
  
  if (!history[plantId]) {
    history[plantId] = [];
  }
  
  // Add to history if not already recorded for this date
  if (!history[plantId].includes(dateStr)) {
    history[plantId].push(dateStr);
    history[plantId].sort().reverse(); // Sort descending (newest first)
  }
  
  saveWateringHistory(history);
  return history;
};

export const getLastWateredDate = (plantId) => {
  const history = getWateringHistory();
  const plantHistory = history[plantId];
  
  if (!plantHistory || plantHistory.length === 0) {
    return null;
  }
  
  // Return the most recent date
  return plantHistory[0];
};

export const getWateringHistoryForPlant = (plantId) => {
  const history = getWateringHistory();
  return history[plantId] || [];
};

export const unmarkPlantAsWatered = (plantId, date) => {
  const history = getWateringHistory();
  const dateStr = formatDate(date);
  
  if (history[plantId]) {
    history[plantId] = history[plantId].filter(d => d !== dateStr);
    if (history[plantId].length === 0) {
      delete history[plantId];
    } else {
      history[plantId].sort().reverse(); // Sort descending (newest first)
    }
    saveWateringHistory(history);
  }
  
  return history;
};

export const clearWateringHistory = (plantId = null) => {
  if (plantId) {
    const history = getWateringHistory();
    delete history[plantId];
    saveWateringHistory(history);
  } else {
    localStorage.removeItem(STORAGE_KEY);
  }
};

export const getNotificationPreferences = () => {
  try {
    const stored = localStorage.getItem(NOTIFICATION_KEY);
    return stored ? JSON.parse(stored) : { enabled: false, dailyCheck: true };
  } catch (error) {
    return { enabled: false, dailyCheck: true };
  }
};

export const saveNotificationPreferences = (preferences) => {
  try {
    localStorage.setItem(NOTIFICATION_KEY, JSON.stringify(preferences));
  } catch (error) {
    console.error('Error saving notification preferences:', error);
  }
};

export const getCustomPlants = () => {
  try {
    const stored = localStorage.getItem(CUSTOM_PLANTS_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error('Error reading custom plants:', error);
    return [];
  }
};

export const saveCustomPlants = (plants) => {
  try {
    localStorage.setItem(CUSTOM_PLANTS_KEY, JSON.stringify(plants));
  } catch (error) {
    console.error('Error saving custom plants:', error);
  }
};

export const addCustomPlant = (plant) => {
  const customPlants = getCustomPlants();
  customPlants.push(plant);
  saveCustomPlants(customPlants);
  return customPlants;
};

export const deleteCustomPlant = (plantId) => {
  const customPlants = getCustomPlants();
  const filtered = customPlants.filter(p => p.id !== plantId);
  saveCustomPlants(filtered);
  return filtered;
};

