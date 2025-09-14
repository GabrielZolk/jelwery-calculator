import AsyncStorage from '@react-native-async-storage/async-storage';

const SALES_KEY = 'jewelry_sales';
const SETTINGS_KEY = 'jewelry_settings';

// Sales management
export const getSales = async () => {
  try {
    const salesData = await AsyncStorage.getItem(SALES_KEY);
    return salesData ? JSON.parse(salesData) : [];
  } catch (error) {
    console.error('Error loading sales:', error);
    return [];
  }
};

export const saveSale = async (sale) => {
  try {
    const sales = await getSales();
    const newSale = {
      id: Date.now().toString(),
      ...sale,
      createdAt: new Date().toISOString(),
    };
    sales.push(newSale);
    await AsyncStorage.setItem(SALES_KEY, JSON.stringify(sales));
    return newSale;
  } catch (error) {
    console.error('Error saving sale:', error);
    throw error;
  }
};

export const updateSale = async (saleId, updatedSale) => {
  try {
    const sales = await getSales();
    const saleIndex = sales.findIndex(sale => sale.id === saleId);
    if (saleIndex >= 0) {
      sales[saleIndex] = { ...sales[saleIndex], ...updatedSale };
      await AsyncStorage.setItem(SALES_KEY, JSON.stringify(sales));
      return sales[saleIndex];
    }
    throw new Error('Sale not found');
  } catch (error) {
    console.error('Error updating sale:', error);
    throw error;
  }
};

export const deleteSale = async (saleId) => {
  try {
    const sales = await getSales();
    const filteredSales = sales.filter(sale => sale.id !== saleId);
    await AsyncStorage.setItem(SALES_KEY, JSON.stringify(filteredSales));
  } catch (error) {
    console.error('Error deleting sale:', error);
    throw error;
  }
};

// Settings management
export const getSettings = async () => {
  try {
    const settingsData = await AsyncStorage.getItem(SETTINGS_KEY);
    return settingsData ? JSON.parse(settingsData) : { commissionRate: 0.1 };
  } catch (error) {
    console.error('Error loading settings:', error);
    return { commissionRate: 0.1 };
  }
};

export const saveSettings = async (settings) => {
  try {
    await AsyncStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
  } catch (error) {
    console.error('Error saving settings:', error);
    throw error;
  }
};
