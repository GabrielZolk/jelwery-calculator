// Format currency in Brazilian Real
export const formatCurrency = (value) => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value);
};

// Format date for display
export const formatDate = (dateString) => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(date);
};

// Format date for month/year display
export const formatMonthYear = (dateString) => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('pt-BR', {
    month: 'long',
    year: 'numeric',
  }).format(date);
};

// Check if date is in range
export const isDateInRange = (date, startDate, endDate) => {
  const checkDate = new Date(date);
  const start = startDate ? new Date(startDate) : null;
  const end = endDate ? new Date(endDate) : null;
  
  if (start && checkDate < start) return false;
  if (end && checkDate > end) return false;
  
  return true;
};

// Calculate commission
export const calculateCommission = (saleValue, commissionRate) => {
  return saleValue * commissionRate;
};

// Get date ranges
export const getDateRanges = () => {
  const today = new Date();
  const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
  const startOfWeek = new Date(today);
  startOfWeek.setDate(today.getDate() - today.getDay());
  
  return {
    today: {
      start: new Date(today.getFullYear(), today.getMonth(), today.getDate()),
      end: today,
    },
    thisWeek: {
      start: startOfWeek,
      end: today,
    },
    thisMonth: {
      start: startOfMonth,
      end: today,
    },
  };
};
