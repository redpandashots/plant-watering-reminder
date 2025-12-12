// Browser notification system for watering reminders

let notificationPermission = null;

export const requestNotificationPermission = async () => {
  if (!('Notification' in window)) {
    console.log('This browser does not support notifications');
    return false;
  }

  if (Notification.permission === 'granted') {
    notificationPermission = 'granted';
    return true;
  }

  if (Notification.permission !== 'denied') {
    const permission = await Notification.requestPermission();
    notificationPermission = permission;
    return permission === 'granted';
  }

  notificationPermission = 'denied';
  return false;
};

export const showNotification = (title, options = {}) => {
  if (Notification.permission !== 'granted') {
    return;
  }

  const notification = new Notification(title, {
    icon: '/vite.svg',
    badge: '/vite.svg',
    ...options
  });

  notification.onclick = () => {
    window.focus();
    notification.close();
  };

  return notification;
};

export const checkAndNotifyWateringDue = (plants, getLastWateredDate, getAdjustedWateringDays, getNextWateringDate, isWateringDue) => {
  const duePlants = plants.filter(plant => {
    const lastWatered = getLastWateredDate(plant.id);
    if (!lastWatered) return false;
    
    const wateringDays = getAdjustedWateringDays(plant);
    const nextWatering = getNextWateringDate(lastWatered, wateringDays);
    return isWateringDue(nextWatering);
  });

  if (duePlants.length > 0) {
    const plantNames = duePlants.map(p => p.name).join(', ');
    showNotification(
      '🌱 Time to Water Your Plants!',
      {
        body: `Don't forget to water: ${plantNames}`,
        tag: 'watering-reminder'
      }
    );
  }
};

export const scheduleDailyCheck = (plants, getLastWateredDate, getAdjustedWateringDays, getNextWateringDate, isWateringDue) => {
  // Check once per day
  const checkInterval = 24 * 60 * 60 * 1000; // 24 hours
  
  const check = () => {
    checkAndNotifyWateringDue(plants, getLastWateredDate, getAdjustedWateringDays, getNextWateringDate, isWateringDue);
  };
  
  // Check immediately
  check();
  
  // Then check daily
  return setInterval(check, checkInterval);
};

