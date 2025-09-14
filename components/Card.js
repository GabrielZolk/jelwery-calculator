import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '../utils/ThemeContext';

export const Card = ({ children, style, onPress, gradient }) => {
  const { theme } = useTheme();
  const CardComponent = onPress ? TouchableOpacity : View;
  
  if (gradient) {
    return (
      <CardComponent onPress={onPress} activeOpacity={0.9}>
        <LinearGradient
          colors={gradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={[styles.card, styles.gradientCard, style]}
        >
          {children}
        </LinearGradient>
      </CardComponent>
    );
  }

  return (
    <CardComponent 
      style={[
        styles.card, 
        { 
          backgroundColor: theme.colors.surface,
          shadowColor: theme.colors.shadow,
        }, 
        style
      ]} 
      onPress={onPress}
      activeOpacity={0.9}
    >
      {children}
    </CardComponent>
  );
};

export const StatsCard = ({ 
  title, 
  value, 
  subtitle, 
  icon, 
  gradient = ['#6366f1', '#8b5cf6'],
  textColor = '#ffffff' 
}) => {
  return (
    <Card gradient={gradient} style={styles.statsCard}>
      <View style={styles.statsContent}>
        <View style={styles.statsText}>
          <Text style={[styles.statsTitle, { color: textColor }]}>{title}</Text>
          <Text style={[styles.statsValue, { color: textColor }]}>{value}</Text>
          {subtitle && (
            <Text style={[styles.statsSubtitle, { color: `${textColor}CC` }]}>
              {subtitle}
            </Text>
          )}
        </View>
        {icon && <View style={styles.statsIcon}>{icon}</View>}
      </View>
    </Card>
  );
};

export const SaleCard = ({ 
  sale, 
  onPress, 
  commissionRate,
  showCommission = true 
}) => {
  const { theme } = useTheme();
  const commission = sale.value * commissionRate;
  
  return (
    <Card onPress={onPress} style={[styles.saleCard, { borderLeftColor: theme.colors.primary }]}>
      <View style={styles.saleHeader}>
        <View style={styles.saleInfo}>
          <Text style={[styles.jewelryType, { color: theme.colors.text }]}>{sale.jewelryType}</Text>
          <Text style={[styles.saleDate, { color: theme.colors.textSecondary }]}>{sale.date}</Text>
        </View>
        <View style={styles.saleValues}>
          <Text style={[styles.saleValue, { color: theme.colors.success }]}>R$ {sale.value.toFixed(2)}</Text>
          {showCommission && (
            <Text style={[styles.commission, { color: theme.colors.primary }]}>
              Comissão: R$ {commission.toFixed(2)}
            </Text>
          )}
        </View>
      </View>
      {sale.description && (
        <Text style={[styles.saleDescription, { color: theme.colors.textSecondary }]} numberOfLines={2}>
          {sale.description}
        </Text>
      )}
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  gradientCard: {
    backgroundColor: 'transparent',
  },
  
  // Stats Card
  statsCard: {
    marginBottom: 12,
  },
  statsContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  statsText: {
    flex: 1,
  },
  statsTitle: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 4,
    opacity: 0.9,
  },
  statsValue: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 2,
  },
  statsSubtitle: {
    fontSize: 12,
    fontWeight: '400',
  },
  statsIcon: {
    marginLeft: 16,
  },
  
  // Sale Card
  saleCard: {
    borderLeftWidth: 4,
    borderLeftColor: '#6366f1',
  },
  saleHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  saleInfo: {
    flex: 1,
  },
  jewelryType: {
    fontSize: 18,
    fontWeight: '600',
    color: '#212529',
    marginBottom: 4,
  },
  saleDate: {
    fontSize: 14,
    color: '#6c757d',
  },
  saleValues: {
    alignItems: 'flex-end',
  },
  saleValue: {
    fontSize: 18,
    fontWeight: '700',
    color: '#28a745',
    marginBottom: 2,
  },
  commission: {
    fontSize: 14,
    color: '#6366f1',
    fontWeight: '500',
  },
  saleDescription: {
    fontSize: 14,
    color: '#6c757d',
    lineHeight: 20,
  },
});
