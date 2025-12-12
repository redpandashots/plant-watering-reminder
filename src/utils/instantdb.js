// InstantDB helper functions for shared plant watering data
import db from '../database';
import { tx, id } from '@instantdb/react';
import { formatDate } from './dateHelpers';

// Schema structure:
// wateringHistory: { id, plantId, date, timestamp }
// customPlants: { id, name, emoji, wateringDays, ...plantData }

/**
 * Mark a plant as watered on a specific date
 */
export const markPlantAsWatered = (plantId, date = new Date()) => {
  const dateStr = formatDate(date);
  const recordId = id(); // Generate unique ID
  
  db.transact([
    tx.wateringHistory[recordId].update({
      plantId,
      date: dateStr,
      timestamp: date.getTime(),
    }),
  ]);
};

/**
 * Remove watering record for a plant on a specific date
 */
export const unmarkPlantAsWatered = (recordId) => {
  db.transact([
    tx.wateringHistory[recordId].delete(),
  ]);
};

/**
 * Get the last watered date for a plant from history array
 */
export const getLastWateredDate = (wateringHistory, plantId) => {
  if (!wateringHistory) return null;
  
  const plantRecords = wateringHistory
    .filter(record => record.plantId === plantId)
    .sort((a, b) => b.timestamp - a.timestamp);
  
  return plantRecords.length > 0 ? plantRecords[0].date : null;
};

/**
 * Get all watering history for a specific plant
 */
export const getWateringHistoryForPlant = (wateringHistory, plantId) => {
  if (!wateringHistory) return [];
  
  return wateringHistory
    .filter(record => record.plantId === plantId)
    .map(record => record.date)
    .sort()
    .reverse();
};

/**
 * Check if plant was watered on a specific date
 */
export const isWateredOnDate = (wateringHistory, plantId, date) => {
  if (!wateringHistory) return false;
  
  const dateStr = formatDate(date);
  return wateringHistory.some(
    record => record.plantId === plantId && record.date === dateStr
  );
};

/**
 * Get the record ID for a plant watered on a specific date
 */
export const getWateringRecordId = (wateringHistory, plantId, date) => {
  if (!wateringHistory) return null;
  
  const dateStr = formatDate(date);
  const record = wateringHistory.find(
    record => record.plantId === plantId && record.date === dateStr
  );
  
  return record ? record.id : null;
};

/**
 * Add a custom plant to the shared database
 */
export const addCustomPlant = (plant) => {
  const plantId = plant.id || id();
  
  db.transact([
    tx.customPlants[plantId].update({
      ...plant,
      id: plantId,
      createdAt: Date.now(),
    }),
  ]);
  
  return plantId;
};

/**
 * Delete a custom plant from the shared database
 */
export const deleteCustomPlant = (plantId) => {
  db.transact([
    tx.customPlants[plantId].delete(),
  ]);
};

// Note: Notification preferences remain local (per-user setting)
// Using localStorage for these
const NOTIFICATION_KEY = 'plant_notification_preferences';

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

