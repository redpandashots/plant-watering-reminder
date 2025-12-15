import React, { useState, useRef } from 'react';
import { isSameDay } from 'date-fns';
import { getAdjustedWateringDays } from '../utils/seasonal';
import { getLastWateredDate, getWateringHistoryForPlant, isWateredOnDate } from '../utils/instantdb';
import { getNextWateringDate, formatDisplayDate, getDaysUntilWatering, isWateringDue, getDaysOverdue, formatDate } from '../utils/dateHelpers';
import { uploadPlantImage, savePlantImage, updateCustomPlantImage, getPlantImageUrl, compressImage } from '../utils/imageUpload';
import '../styles/PlantCard.css';

const PlantCard = ({ plant, wateringHistory, plantImages, onWaterClick, onDelete, isCustomPlant }) => {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState(null);
  const fileInputRef = useRef(null);
  const lastWatered = getLastWateredDate(wateringHistory, plant.id);
  const wateringDays = getAdjustedWateringDays(plant);
  const nextWateringDate = lastWatered ? getNextWateringDate(lastWatered, wateringDays) : null;
  const daysUntil = nextWateringDate ? getDaysUntilWatering(nextWateringDate) : null;
  const isDue = nextWateringDate ? isWateringDue(nextWateringDate) : false;
  const daysOverdue = nextWateringDate ? getDaysOverdue(nextWateringDate) : 0;
  
  // Check if plant was actually watered TODAY
  const isWateredToday = () => {
    return isWateredOnDate(wateringHistory, plant.id, new Date());
  };

  // Get plant image URL (either from custom plant or plantImages collection)
  const plantImageUrl = plant.imageUrl || getPlantImageUrl(plantImages, plant.id);

  // Handle image upload
  const handleImageUpload = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setUploadError(null);

    try {
      // Compress image before upload
      const compressedFile = await compressImage(file);
      
      // Upload to InstantDB storage
      const imageUrl = await uploadPlantImage(compressedFile);
      
      // Save to database
      if (plant.id.startsWith('custom-') || isCustomPlant) {
        // Update custom plant with image URL
        updateCustomPlantImage(plant.id, imageUrl);
      } else {
        // Save to plantImages collection for default plants
        savePlantImage(plant.id, imageUrl);
      }
      
      setIsUploading(false);
    } catch (error) {
      console.error('Error uploading image:', error);
      setUploadError(error.message || 'Failed to upload image');
      setIsUploading(false);
    }
  };

  // Trigger file input click
  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const getStatusClass = () => {
    if (!lastWatered) return 'status-new';
    if (isDue) return daysOverdue > 0 ? 'status-overdue' : 'status-due';
    if (daysUntil !== null && daysUntil <= 2) return 'status-soon';
    return 'status-ok';
  };

  const getStatusText = () => {
    if (!lastWatered) return 'Not tracked yet';
    if (isDue) return daysOverdue > 0 ? `${daysOverdue} day${daysOverdue > 1 ? 's' : ''} overdue` : 'Due today!';
    if (daysUntil !== null) {
      if (daysUntil === 0) return 'Due today!';
      if (daysUntil === 1) return 'Due tomorrow';
      return `Due in ${daysUntil} days`;
    }
    return 'Unknown';
  };

  return (
    <div className={`plant-card ${getStatusClass()}`}>
      {onDelete && (
        <button 
          className="delete-plant-btn"
          onClick={() => onDelete(plant.id)}
          title="Delete this plant"
        >
          🗑️
        </button>
      )}
      <div className="plant-header">
        <div className="plant-emoji">{plant.emoji}</div>
        <h3 className="plant-name">{plant.name}</h3>
      </div>

      {/* Plant Image Display and Upload */}
      <div className="plant-image-section">
        {plantImageUrl ? (
          <div className="plant-image-container">
            <img src={plantImageUrl} alt={plant.name} className="plant-image" />
            <button 
              className="change-image-btn"
              onClick={handleUploadClick}
              disabled={isUploading}
              title="Change plant photo"
            >
              📷 Change Photo
            </button>
          </div>
        ) : (
          <button 
            className="upload-image-btn"
            onClick={handleUploadClick}
            disabled={isUploading}
            title="Upload plant photo"
          >
            {isUploading ? '⏳ Uploading...' : '📷 Add Photo'}
          </button>
        )}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleImageUpload}
          style={{ display: 'none' }}
        />
        {uploadError && (
          <p className="upload-error">{uploadError}</p>
        )}
      </div>
      
      <div className="plant-info">
        <div className="plant-status">
          <span className={`status-badge ${getStatusClass()}`}>
            {getStatusText()}
          </span>
        </div>
        
        {lastWatered && (
          <div className="plant-details">
            <div className="detail-item">
              <span className="detail-label">Last watered:</span>
              <span className="detail-value">{formatDisplayDate(new Date(lastWatered))}</span>
            </div>
            {nextWateringDate && (
              <div className="detail-item">
                <span className="detail-label">Next watering:</span>
                <span className="detail-value">{formatDisplayDate(nextWateringDate)}</span>
              </div>
            )}
            <div className="detail-item">
              <span className="detail-label">Frequency:</span>
              <span className="detail-value">Every {wateringDays} days</span>
            </div>
          </div>
        )}
        
        {!lastWatered && (
          <div className="plant-details">
            <div className="detail-item">
              <span className="detail-label">Frequency:</span>
              <span className="detail-value">Every {wateringDays} days</span>
            </div>
            <p className="no-history-text">Click "Watered Today" to start tracking!</p>
          </div>
        )}
      </div>
      
      <div className="plant-care-tips">
        <details className="care-tips-details">
          <summary className="care-tips-summary">💡 Care Tips</summary>
          <ul className="care-tips-list">
            {plant.careTips.map((tip, index) => (
              <li key={index}>{tip}</li>
            ))}
          </ul>
        </details>
      </div>
      
      <button 
        className={`water-button ${isWateredToday() ? 'watered-today' : 'water-me'}`}
        onClick={() => onWaterClick(plant.id)}
      >
        {isWateredToday() ? '✓ Watered Today' : 'Water Me'}
      </button>
    </div>
  );
};

export default PlantCard;

