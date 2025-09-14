import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Ionicons } from '@expo/vector-icons';
import { formatDate } from '../utils/helpers';

export const DatePicker = ({ 
  label, 
  value, 
  onDateChange, 
  minimumDate, 
  maximumDate,
  style 
}) => {
  const [showPicker, setShowPicker] = useState(false);

  const handleDatePress = () => {
    setShowPicker(true);
  };

  const handleDateChange = (event, selectedDate) => {
    setShowPicker(Platform.OS === 'ios');
    
    if (selectedDate) {
      onDateChange(selectedDate);
    }
  };

  return (
    <View style={[styles.container, style]}>
      {label && <Text style={styles.label}>{label}</Text>}
      
      <TouchableOpacity style={styles.dateButton} onPress={handleDatePress}>
        <Text style={styles.dateText}>
          {value ? formatDate(value) : 'Selecione a data'}
        </Text>
        <Ionicons name="calendar" size={20} color="#6366f1" />
      </TouchableOpacity>

      {showPicker && (
        <DateTimePicker
          value={value || new Date()}
          mode="date"
          display={Platform.OS === 'ios' ? 'spinner' : 'default'}
          onChange={handleDateChange}
          minimumDate={minimumDate}
          maximumDate={maximumDate}
        />
      )}
    </View>
  );
};

export const DateRangePicker = ({ 
  startDate, 
  endDate, 
  onStartDateChange, 
  onEndDateChange,
  style 
}) => {
  return (
    <View style={[styles.rangeContainer, style]}>
      <View style={styles.datePickerHalf}>
        <DatePicker
          label="Data inicial"
          value={startDate}
          onDateChange={onStartDateChange}
          maximumDate={endDate || new Date()}
        />
      </View>
      
      <View style={styles.datePickerHalf}>
        <DatePicker
          label="Data final"
          value={endDate}
          onDateChange={onEndDateChange}
          minimumDate={startDate}
          maximumDate={new Date()}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
    color: '#495057',
    marginBottom: 8,
  },
  dateButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#e9ecef',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    minHeight: 52,
  },
  dateText: {
    fontSize: 16,
    color: '#495057',
  },
  rangeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  datePickerHalf: {
    flex: 0.48,
  },
});
