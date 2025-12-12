import { format, addDays, isSameDay, isPast, isToday, startOfDay, differenceInDays } from 'date-fns';

export const formatDate = (date) => {
  return format(date, 'yyyy-MM-dd');
};

export const formatDisplayDate = (date) => {
  return format(date, 'MMM d, yyyy');
};

export const getNextWateringDate = (lastWateredDate, wateringDays) => {
  if (!lastWateredDate) {
    return null;
  }
  return addDays(new Date(lastWateredDate), wateringDays);
};

export const isWateringDue = (nextWateringDate) => {
  if (!nextWateringDate) return false;
  const today = startOfDay(new Date());
  const wateringDate = startOfDay(new Date(nextWateringDate));
  return isPast(wateringDate) || isToday(wateringDate);
};

export const getDaysUntilWatering = (nextWateringDate) => {
  if (!nextWateringDate) return null;
  const today = startOfDay(new Date());
  const wateringDate = startOfDay(new Date(nextWateringDate));
  return differenceInDays(wateringDate, today);
};

export const getDaysOverdue = (nextWateringDate) => {
  if (!nextWateringDate) return 0;
  const today = startOfDay(new Date());
  const wateringDate = startOfDay(new Date(nextWateringDate));
  if (isPast(wateringDate) && !isToday(wateringDate)) {
    return Math.abs(differenceInDays(wateringDate, today));
  }
  return 0;
};

