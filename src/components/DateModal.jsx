import React, { useState, useEffect } from 'react';
import { formatDisplayDate, formatDate } from '../utils/dateHelpers';
import { getWateringHistoryForPlant } from '../utils/storage';
import { isSameDay } from 'date-fns';
import '../styles/DateModal.css';

const DateModal = ({ selectedDate, plants, onClose, onMarkWatered, onUnmarkWatered, refreshKey }) => {
  const [localRefresh, setLocalRefresh] = useState(0);

  if (!selectedDate) return null;

  const dateStr = formatDate(selectedDate);
  const selectedDateObj = new Date(selectedDate);

  // Force re-render when refreshKey changes
  useEffect(() => {
    setLocalRefresh(prev => prev + 1);
  }, [refreshKey]);

  const isPlantWateredOnDate = (plantId) => {
    const history = getWateringHistoryForPlant(plantId);
    const selectedDateStr = formatDate(selectedDateObj);
    // Use string comparison for reliability (dates are stored as YYYY-MM-DD)
    return history.includes(selectedDateStr);
  };

  const handleMarkWatered = (plantId, e) => {
    e.stopPropagation();
    if (onMarkWatered) {
      onMarkWatered(plantId, selectedDateObj);
      // Force local re-render
      setTimeout(() => setLocalRefresh(prev => prev + 1), 100);
    }
  };

  const handleUnmarkWatered = (plantId, e) => {
    e.stopPropagation();
    if (onUnmarkWatered) {
      onUnmarkWatered(plantId, selectedDateObj);
      // Force local re-render
      setTimeout(() => setLocalRefresh(prev => prev + 1), 100);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>Mark Plants as Watered</h3>
          <button className="modal-close-btn" onClick={onClose}>×</button>
        </div>
        
        <div className="modal-date">
          <span className="modal-date-label">Date:</span>
          <span className="modal-date-value">{formatDisplayDate(selectedDateObj)}</span>
        </div>

        <div className="modal-plants">
          <p className="modal-instruction">Select plants to mark as watered on this date:</p>
          <div className="modal-plants-list">
            {plants.map(plant => {
              const isWatered = isPlantWateredOnDate(plant.id);
              return (
                <div 
                  key={plant.id} 
                  className={`modal-plant-item ${isWatered ? 'watered' : ''}`}
                >
                  <div className="modal-plant-info">
                    <span className="modal-plant-emoji">{plant.emoji}</span>
                    <span className="modal-plant-name">{plant.name}</span>
                  </div>
                  <div className="modal-plant-actions">
                    {isWatered ? (
                      <>
                        <span className="modal-watered-indicator">✓ Watered</span>
                        <button
                          className="modal-delete-btn"
                          onClick={(e) => handleUnmarkWatered(plant.id, e)}
                          title="Remove watering record for this date"
                        >
                          🗑️ Remove
                        </button>
                      </>
                    ) : (
                      <button
                        className="modal-water-btn"
                        onClick={(e) => handleMarkWatered(plant.id, e)}
                      >
                        💧 Mark as Watered
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DateModal;

