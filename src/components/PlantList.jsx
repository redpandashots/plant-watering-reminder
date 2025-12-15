import React from 'react';
import PlantCard from './PlantCard';
import '../styles/PlantList.css';

const PlantList = ({ plants, wateringHistory, plantImages, onWaterClick, onNewPlantClick, onDeletePlant }) => {
  return (
    <div className="plant-list-container">
      <div className="plant-list">
        {plants.map(plant => (
          <PlantCard 
            key={plant.id} 
            plant={plant}
            wateringHistory={wateringHistory}
            plantImages={plantImages}
            onWaterClick={onWaterClick}
            onDelete={onDeletePlant}
          />
        ))}
        <div className="new-plant-card" onClick={onNewPlantClick}>
          <div className="new-plant-content">
            <div className="new-plant-icon">➕</div>
            <h3 className="new-plant-title">New Plant</h3>
            <p className="new-plant-subtitle">Add a new plant to track</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlantList;

