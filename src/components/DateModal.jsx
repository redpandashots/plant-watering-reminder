import React from 'react';
import { formatDisplayDate, formatDate } from '../utils/dateHelpers';
import { isWateredOnDate } from '../utils/instantdb';
import { isSameDay } from 'date-fns';
import '../styles/DateModal.css';

const DateModal = ({ selectedDate, plants, wateringHistory, onClose, onMarkWatered, onUnmarkWatered }) => {
  if (!selectedDate) return null;

  const dateStr = formatDate(selectedDate);
  const selectedDateObj = new Date(selectedDate);

  const isPlantWateredOnDate = (plantId) => {
    return isWateredOnDate(wateringHistory, plantId, selectedDateObj);
  };

  const handleMarkWatered = (plantId, e) => {
    e.stopPropagation();
    if (onMarkWatered) {
      onMarkWatered(plantId, selectedDateObj);
      // InstantDB will automatically update the UI
    }
  };

  const handleUnmarkWatered = (plantId, e) => {
    e.stopPropagation();
    if (onUnmarkWatered) {
      onUnmarkWatered(plantId, selectedDateObj);
      // InstantDB will automatically update the UI
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

