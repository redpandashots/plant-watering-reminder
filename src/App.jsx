import React, { useState, useEffect, useCallback } from 'react';
import { PLANTS } from './data/plants';
import PlantList from './components/PlantList';
import Calendar from './components/Calendar';
import NewPlantModal from './components/NewPlantModal';
import { markPlantAsWatered, unmarkPlantAsWatered, getNotificationPreferences, saveNotificationPreferences, getCustomPlants, addCustomPlant, getWateringHistoryForPlant } from './utils/storage';
import { requestNotificationPermission, scheduleDailyCheck } from './utils/notifications';
import { getLastWateredDate } from './utils/storage';
import { getAdjustedWateringDays } from './utils/seasonal';
import { getNextWateringDate, isWateringDue, formatDate } from './utils/dateHelpers';
import { getCurrentSeason } from './utils/seasonal';
import './styles/App.css';

function App() {
  const [allPlants, setAllPlants] = useState([...PLANTS, ...getCustomPlants()]);
  const [refreshKey, setRefreshKey] = useState(0);
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  const [showCalendar, setShowCalendar] = useState(true);
  const [showNewPlantModal, setShowNewPlantModal] = useState(false);
  const [currentSeason] = useState(getCurrentSeason());

  // Force re-render to update plant statuses
  const refresh = useCallback(() => {
    setRefreshKey(prev => prev + 1);
  }, []);

  // Handle watering a plant (toggle for today)
  const handleWaterClick = (plantId) => {
    const today = new Date();
    const todayStr = formatDate(today);
    const history = getWateringHistoryForPlant(plantId);
    
    // Check if already watered today
    if (history.includes(todayStr)) {
      // Unmark for today
      unmarkPlantAsWatered(plantId, today);
    } else {
      // Mark as watered today
      markPlantAsWatered(plantId, today);
    }
    refresh();
  };

  // Handle unmarking a plant as watered
  const handleUnmarkWatered = (plantId, date) => {
    unmarkPlantAsWatered(plantId, date);
    refresh(); // Force re-render of calendar and modal
  };

  // Load notification preferences
  useEffect(() => {
    const prefs = getNotificationPreferences();
    setNotificationsEnabled(prefs.enabled);
  }, []);

  // Load custom plants on mount
  useEffect(() => {
    const customPlants = getCustomPlants();
    setAllPlants([...PLANTS, ...customPlants]);
  }, []);

  // Request notification permission and set up daily checks
  useEffect(() => {
    let interval = null;
    
    if (notificationsEnabled) {
      requestNotificationPermission().then(hasPermission => {
        if (hasPermission) {
          interval = scheduleDailyCheck(
            allPlants,
            getLastWateredDate,
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
  }, [notificationsEnabled, allPlants]);

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
    setAllPlants([...PLANTS, ...getCustomPlants()]);
    refresh();
  };

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
              key={refreshKey}
              plants={allPlants}
              refreshKey={refreshKey}
              onDateClick={(date) => {
                // Date click handled in Calendar component
              }}
              onMarkWatered={(plantId, date) => {
                markPlantAsWatered(plantId, date);
                refresh();
              }}
              onUnmarkWatered={(plantId, date) => {
                handleUnmarkWatered(plantId, date);
              }}
            />
          </div>
        ) : (
          <div className="plants-view">
            <PlantList 
              key={refreshKey}
              plants={allPlants} 
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

