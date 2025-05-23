
export const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric'
  });
};

export const isOverdue = (dateString: string) => {
  const today = new Date();
  const dueDate = new Date(dateString);
  today.setHours(0, 0, 0, 0);
  dueDate.setHours(0, 0, 0, 0);
  return dueDate < today && !isToday(dateString);
};

export const isToday = (dateString: string) => {
  const today = new Date();
  const dueDate = new Date(dateString);
  return today.toDateString() === dueDate.toDateString();
};
