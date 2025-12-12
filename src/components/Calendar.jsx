import React, { useState } from 'react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, addMonths, subMonths, startOfWeek, endOfWeek, isBefore, isAfter } from 'date-fns';
import { getAdjustedWateringDays } from '../utils/seasonal';
import { getLastWateredDate, getWateringHistoryForPlant } from '../utils/storage';
import { getNextWateringDate, formatDate } from '../utils/dateHelpers';
import DateModal from './DateModal';
import '../styles/Calendar.css';

const Calendar = ({ plants, onDateClick, onMarkWatered, onUnmarkWatered, refreshKey }) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const calendarStart = startOfWeek(monthStart, { weekStartsOn: 1 }); // 1 = Monday
  const calendarEnd = endOfWeek(monthEnd, { weekStartsOn: 1 }); // 1 = Monday
  const days = eachDayOfInterval({ start: calendarStart, end: calendarEnd });

  const getWateringDatesForMonth = () => {
    const wateringDates = {};
    const endDate = new Date('2030-12-31T23:59:59'); // Generate dates up to end of 2030
    
    plants.forEach(plant => {
      const lastWatered = getLastWateredDate(plant.id);
      if (!lastWatered) return;
      
      // Start from the last watered date
      let currentWateringDate = new Date(lastWatered);
      
      // Generate all watering dates up to 2030
      while (currentWateringDate <= endDate) {
        // Get the season for the current date to calculate proper interval
        const season = getSeasonForDate(currentWateringDate);
        const adjustedDays = Math.round(plant.baseWateringDays * plant.seasonalAdjustments[season]);
        
        // Calculate next watering date
        const nextWatering = new Date(currentWateringDate);
        nextWatering.setDate(nextWatering.getDate() + adjustedDays);
        
        // Only add dates that are in the current month being viewed
        if (isSameMonth(nextWatering, currentMonth)) {
          const dateStr = formatDate(nextWatering);
          if (!wateringDates[dateStr]) {
            wateringDates[dateStr] = [];
          }
          wateringDates[dateStr].push(plant);
        }
        
        // Move to next watering date
        currentWateringDate = nextWatering;
      }
    });
    
    return wateringDates;
  };

  // Helper function to get season for a specific date
  const getSeasonForDate = (date) => {
    const month = date.getMonth() + 1; // getMonth() returns 0-11
    if (month >= 12 || month <= 2) return 'winter';
    if (month >= 3 && month <= 5) return 'spring';
    if (month >= 6 && month <= 8) return 'summer';
    return 'fall';
  };

  // Helper function to get adjusted watering days for a specific date
  const getAdjustedWateringDaysForDate = (plant, date) => {
    const season = getSeasonForDate(date);
    return Math.round(plant.baseWateringDays * plant.seasonalAdjustments[season]);
  };

  const getWateredPlantsForDate = (date) => {
    const wateredPlants = [];
    plants.forEach(plant => {
      const history = getWateringHistoryForPlant(plant.id);
      const dateStr = formatDate(date);
      if (history.includes(dateStr)) {
        wateredPlants.push(plant);
      }
    });
    return wateredPlants;
  };

  const wateringDates = getWateringDatesForMonth();
  const today = new Date();

  const previousMonth = () => {
    setCurrentMonth(subMonths(currentMonth, 1));
  };

  const nextMonth = () => {
    setCurrentMonth(addMonths(currentMonth, 1));
  };

  const handleDateClick = (day) => {
    setSelectedDate(day);
    if (onDateClick) {
      onDateClick(day);
    }
  };

  const handleMarkWatered = (plantId, date) => {
    if (onMarkWatered) {
      onMarkWatered(plantId, date);
    }
  };

  const handleUnmarkWatered = (plantId, date) => {
    if (onUnmarkWatered) {
      onUnmarkWatered(plantId, date);
    }
  };

  const handleCloseModal = () => {
    setSelectedDate(null);
  };

  return (
    <div className="calendar-container">
      <div className="calendar-header">
        <button onClick={previousMonth} className="calendar-nav-btn">‹</button>
        <div className="calendar-title-section">
          <h2 className="calendar-month-title">{format(currentMonth, 'MMMM yyyy')}</h2>
          <p className="calendar-instruction">Click any date to mark plants as watered</p>
        </div>
        <button onClick={nextMonth} className="calendar-nav-btn">›</button>
      </div>
      
      <div className="calendar-grid">
        <div className="calendar-weekdays">
          {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(day => (
            <div key={day} className="calendar-weekday">{day}</div>
          ))}
        </div>
        
        <div className="calendar-days">
          {days.map(day => {
            const dateStr = formatDate(day);
            const isCurrentMonth = isSameMonth(day, currentMonth);
            const isTodayDate = isSameDay(day, today);
            const plantsToWater = wateringDates[dateStr] || [];
            const wateredPlants = getWateredPlantsForDate(day);
            const hasWateredPlants = wateredPlants.length > 0;
            
            return (
              <div
                key={dateStr}
                className={`calendar-day ${!isCurrentMonth ? 'other-month' : ''} ${isTodayDate ? 'today' : ''} ${plantsToWater.length > 0 ? 'has-watering' : ''} ${hasWateredPlants ? 'has-watered' : ''}`}
                onClick={() => handleDateClick(day)}
                title={hasWateredPlants ? `Watered: ${wateredPlants.map(p => p.name).join(', ')}` : plantsToWater.length > 0 ? `Due: ${plantsToWater.map(p => p.name).join(', ')}` : 'Click to mark plants as watered'}
              >
                {isTodayDate && <div className="today-indicator"></div>}
                <div className="day-number">{format(day, 'd')}</div>
                {hasWateredPlants && (
                  <div className="watered-indicators">
                    {wateredPlants.map(plant => (
                      <span
                        key={plant.id}
                        className="watered-dot"
                        style={{ backgroundColor: plant.color }}
                        title={`${plant.name} - Watered`}
                      >
                        ✓
                      </span>
                    ))}
                  </div>
                )}
                {plantsToWater.length > 0 && !hasWateredPlants && (
                  <div className="watering-indicators">
                    {plantsToWater.map(plant => (
                      <span
                        key={plant.id}
                        className="watering-dot"
                        style={{ backgroundColor: plant.color }}
                        title={plant.name}
                      />
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
      
      <div className="calendar-legend">
        <div className="legend-section">
          <div className="legend-title">Status Indicators</div>
          <div className="legend-item">
            <span className="legend-dot today-dot"></span>
            <span>Today</span>
          </div>
          <div className="legend-item">
            <span className="legend-dot" style={{ backgroundColor: 'var(--warning-color)' }}></span>
            <span>Scheduled Watering</span>
          </div>
          <div className="legend-item">
            <span className="legend-dot" style={{ backgroundColor: 'var(--success-color)' }}>✓</span>
            <span>Watered</span>
          </div>
        </div>
        <div className="legend-section">
          <div className="legend-title">Your Plants</div>
          {plants.map(plant => (
            <div key={plant.id} className="legend-item">
              <span className="legend-dot" style={{ backgroundColor: plant.color }}></span>
              <span>{plant.name}</span>
            </div>
          ))}
        </div>
      </div>

      {selectedDate && (
        <DateModal
          key={`modal-${selectedDate.getTime()}`}
          selectedDate={selectedDate}
          plants={plants}
          onClose={handleCloseModal}
          onMarkWatered={handleMarkWatered}
          onUnmarkWatered={handleUnmarkWatered}
          refreshKey={refreshKey}
        />
      )}
    </div>
  );
};

export default Calendar;

