import React, { useState } from 'react';
import { researchPlantInfo } from '../utils/plantResearch';
import '../styles/NewPlantModal.css';

const NewPlantModal = ({ onClose, onAddPlant }) => {
  const [plantName, setPlantName] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState(null);
  const [error, setError] = useState('');

  const handleSearch = async () => {
    if (!plantName.trim()) {
      setError('Please enter a plant name');
      return;
    }

    setIsSearching(true);
    setError('');
    setSearchResults(null);

    try {
      // Research plant information using the utility function
      // This uses built-in knowledge and can be enhanced with web search
      const plantInfo = await researchPlantInfo(plantName);
      setSearchResults(plantInfo);
    } catch (err) {
      console.error('Error researching plant:', err);
      setError('Error researching plant. Please try again.');
    } finally {
      setIsSearching(false);
    }
  };

  const handleAddPlant = () => {
    if (!searchResults) {
      setError('Please search for plant information first');
      return;
    }

    const newPlant = {
      id: `custom-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      name: searchResults.name,
      emoji: searchResults.emoji,
      baseWateringDays: searchResults.baseWateringDays,
      seasonalAdjustments: searchResults.seasonalAdjustments,
      careTips: searchResults.careTips,
      color: searchResults.color,
      isCustom: true
    };

    onAddPlant(newPlant);
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content new-plant-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>Add New Plant</h3>
          <button className="modal-close-btn" onClick={onClose}>×</button>
        </div>

        <div className="new-plant-form">
          <div className="form-group">
            <label htmlFor="plant-name">Plant Name:</label>
            <input
              id="plant-name"
              type="text"
              value={plantName}
              onChange={(e) => setPlantName(e.target.value)}
              placeholder="e.g., Monstera, Snake Plant, Fern..."
              className="plant-name-input"
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
            />
          </div>

          <button
            className="search-btn"
            onClick={handleSearch}
            disabled={isSearching || !plantName.trim()}
          >
            {isSearching ? '🔍 Researching...' : '🔍 Research Plant Care'}
          </button>

          {error && <div className="error-message">{error}</div>}

          {searchResults && (
            <div className="plant-preview">
              <h4>Plant Information:</h4>
              <div className="preview-content">
                <div className="preview-header">
                  <span className="preview-emoji">{searchResults.emoji}</span>
                  <span className="preview-name">{searchResults.name}</span>
                </div>
                <div className="preview-details">
                  <div className="preview-item">
                    <strong>Watering Frequency:</strong> Every {searchResults.baseWateringDays} days
                  </div>
                  <div className="preview-item">
                    <strong>Care Tips:</strong>
                    <ul>
                      {searchResults.careTips.map((tip, index) => (
                        <li key={index}>{tip}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
              <button className="add-plant-btn" onClick={handleAddPlant}>
                ➕ Add Plant
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default NewPlantModal;

