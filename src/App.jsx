import React, { useState, useEffect, useCallback } from 'react';
import { PLANTS } from './data/plants';
import PlantList from './components/PlantList';
import Calendar from './components/Calendar';
import NewPlantModal from './components/NewPlantModal';
import db from './database';
import { 
  markPlantAsWatered, 
  unmarkPlantAsWatered, 
  getNotificationPreferences, 
  saveNotificationPreferences, 
  addCustomPlant,
  getWateringHistoryForPlant,
  getLastWateredDate,
  isWateredOnDate,
  getWateringRecordId
} from './utils/instantdb';
import { requestNotificationPermission, scheduleDailyCheck } from './utils/notifications';
import { getAdjustedWateringDays } from './utils/seasonal';
import { getNextWateringDate, isWateringDue, formatDate } from './utils/dateHelpers';
import { getCurrentSeason } from './utils/seasonal';
import './styles/App.css';

function App() {
  // Fetch shared data from InstantDB
  const { isLoading, error, data } = db.useQuery({
    wateringHistory: {},
    customPlants: {},
  });

  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  const [showCalendar, setShowCalendar] = useState(true);
  const [showNewPlantModal, setShowNewPlantModal] = useState(false);
  const [currentSeason] = useState(getCurrentSeason());

  // Combine default plants with custom plants from database
  const customPlantsArray = data?.customPlants || [];
  const allPlants = [...PLANTS, ...customPlantsArray];
  
  const wateringHistory = data?.wateringHistory || [];

  // Force re-render helper (not needed with InstantDB's reactive updates)
  const refresh = useCallback(() => {
    // InstantDB automatically updates, but keeping for compatibility
  }, []);

  // Handle watering a plant (toggle for today)
  const handleWaterClick = (plantId) => {
    const today = new Date();
    
    // Check if already watered today
    if (isWateredOnDate(wateringHistory, plantId, today)) {
      // Unmark for today - find the record ID and delete it
      const recordId = getWateringRecordId(wateringHistory, plantId, today);
      if (recordId) {
        unmarkPlantAsWatered(recordId);
      }
    } else {
      // Mark as watered today
      markPlantAsWatered(plantId, today);
    }
  };

  // Handle unmarking a plant as watered
  const handleUnmarkWatered = (plantId, date) => {
    const recordId = getWateringRecordId(wateringHistory, plantId, date);
    if (recordId) {
      unmarkPlantAsWatered(recordId);
    }
  };

  // Load notification preferences
  useEffect(() => {
    const prefs = getNotificationPreferences();
    setNotificationsEnabled(prefs.enabled);
  }, []);

  // Custom plants are automatically loaded via InstantDB useQuery hook
  // No need for separate useEffect

  // Request notification permission and set up daily checks
  useEffect(() => {
    let interval = null;
    
    if (notificationsEnabled && wateringHistory) {
      requestNotificationPermission().then(hasPermission => {
        if (hasPermission) {
          // Create a wrapper function that passes wateringHistory to getLastWateredDate
          const getLastWateredDateForPlant = (plantId) => {
            return getLastWateredDate(wateringHistory, plantId);
          };
          
          interval = scheduleDailyCheck(
            allPlants,
            getLastWateredDateForPlant,
            getAdjustedWateringDays,
            getNextWateringDate,
            isWateringDue
          );
        }
      });
    }
    
    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [notificationsEnabled, allPlants, wateringHistory]);

  // Toggle notifications
  const handleToggleNotifications = async () => {
    if (!notificationsEnabled) {
      const hasPermission = await requestNotificationPermission();
      if (hasPermission) {
        setNotificationsEnabled(true);
        saveNotificationPreferences({ enabled: true, dailyCheck: true });
      }
    } else {
      setNotificationsEnabled(false);
      saveNotificationPreferences({ enabled: false, dailyCheck: false });
    }
  };

  // Handle adding a new plant
  const handleAddPlant = (newPlant) => {
    addCustomPlant(newPlant);
    // InstantDB will automatically update the UI
  };

  // Show loading state while data is being fetched
  if (isLoading) {
    return (
      <div className="app">
        <div className="loading-container">
          <div className="loading-spinner">🌱</div>
          <p>Loading your plants...</p>
        </div>
      </div>
    );
  }

  // Show error state if there's an error
  if (error) {
    return (
      <div className="app">
        <div className="error-container">
          <p>❌ Error loading data: {error.message}</p>
          <p>Please refresh the page or check your internet connection.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="app">
      <header className="app-header">
        <h1 className="app-title">
          <span className="title-emoji">🌱</span>
          Plant Watering Reminder
        </h1>
        <div className="header-info">
          <span className="season-badge">Season: {currentSeason.charAt(0).toUpperCase() + currentSeason.slice(1)}</span>
          <button 
            className={`notification-toggle ${notificationsEnabled ? 'enabled' : ''}`}
            onClick={handleToggleNotifications}
            title={notificationsEnabled ? 'Disable notifications' : 'Enable notifications'}
          >
            {notificationsEnabled ? '🔔' : '🔕'}
          </button>
        </div>
      </header>

      <main className="app-main">
        <div className="view-toggle">
          <button 
            className={`toggle-btn ${!showCalendar ? 'active' : ''}`}
            onClick={() => setShowCalendar(false)}
          >
            Plants
          </button>
          <button 
            className={`toggle-btn ${showCalendar ? 'active' : ''}`}
            onClick={() => setShowCalendar(true)}
          >
            Calendar
          </button>
        </div>

        {showCalendar ? (
          <div className="calendar-view">
            <Calendar 
              plants={allPlants}
              wateringHistory={wateringHistory}
              onDateClick={(date) => {
                // Date click handled in Calendar component
              }}
              onMarkWatered={(plantId, date) => {
                markPlantAsWatered(plantId, date);
              }}
              onUnmarkWatered={(plantId, date) => {
                handleUnmarkWatered(plantId, date);
              }}
            />
          </div>
        ) : (
          <div className="plants-view">
            <PlantList 
              plants={allPlants}
              wateringHistory={wateringHistory}
              onWaterClick={handleWaterClick}
              onNewPlantClick={() => setShowNewPlantModal(true)}
            />
          </div>
        )}

        {showNewPlantModal && (
          <NewPlantModal
            onClose={() => setShowNewPlantModal(false)}
            onAddPlant={handleAddPlant}
          />
        )}
      </main>

      <footer className="app-footer">
        <p>Keep your plants happy and hydrated! 💚</p>
      </footer>
    </div>
  );
}

export default App;

