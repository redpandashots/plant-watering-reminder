// Image upload utilities for plant photos
import db from '../database';
import { tx, id } from '@instantdb/react';

/**
 * Compress and resize image before upload
 */
export const compressImage = (file, maxWidth = 800, maxHeight = 800, quality = 0.8) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (e) => {
      const img = new Image();
      
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;
        
        // Calculate new dimensions
        if (width > height) {
          if (width > maxWidth) {
            height = (height * maxWidth) / width;
            width = maxWidth;
          }
        } else {
          if (height > maxHeight) {
            width = (width * maxHeight) / height;
            height = maxHeight;
          }
        }
        
        canvas.width = width;
        canvas.height = height;
        
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);
        
        canvas.toBlob((blob) => {
          resolve(blob);
        }, 'image/jpeg', quality);
      };
      
      img.onerror = reject;
      img.src = e.target.result;
    };
    
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

/**
 * Convert blob to base64 data URL
 */
const blobToBase64 = (blob) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
};

/**
 * Upload image file - converts to base64 and stores in database
 */
export const uploadPlantImage = async (fileOrBlob) => {
  try {
    // Convert image to base64 data URL
    const base64Data = await blobToBase64(fileOrBlob);
    
    // Return the base64 data URL to be stored in database
    return base64Data;
  } catch (error) {
    console.error('Error converting image:', error);
    throw error;
  }
};

/**
 * Save plant image URL to database
 */
export const savePlantImage = (plantId, imageUrl) => {
  const imageId = id();
  db.transact([
    tx.plantImages[imageId].update({
      plantId,
      imageUrl,
      uploadedAt: Date.now(),
    }),
  ]);
};

/**
 * Update custom plant with image URL
 */
export const updateCustomPlantImage = (plantId, imageUrl) => {
  db.transact([
    tx.customPlants[plantId].update({
      imageUrl,
    }),
  ]);
};

/**
 * Get plant image URL from database
 */
export const getPlantImage = (plantImages, plantId) => {
  if (!plantImages) return null;
  
  const plantImageRecords = plantImages
    .filter(record => record.plantId === plantId)
    .sort((a, b) => b.uploadedAt - a.uploadedAt);
  
  return plantImageRecords.length > 0 ? plantImageRecords[0].imageUrl : null;
};

/**
 * Get plant image URL (alias for getPlantImage)
 */
export const getPlantImageUrl = getPlantImage;

/**
 * Delete plant image
 */
export const deletePlantImage = (imageRecordId) => {
  db.transact([
    tx.plantImages[imageRecordId].delete(),
  ]);
};
