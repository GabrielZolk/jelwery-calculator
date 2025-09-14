import React, { useState, useEffect, useCallback } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity,
  RefreshControl,
  Alert 
} from 'react-native';
import { useFocusEffect } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { Button, Card, StatsCard, SaleCard, DateRangePicker } from '../../components';
import { getSales, getSettings, deleteSale } from '../../utils/storage';
import { formatCurrency, isDateInRange, calculateCommission } from '../../utils/helpers';

const FILTER_PERIODS = [
  { id: 'all', label: 'Todos' },
  { id: 'today', label: 'Hoje' },
  { id: 'week', label: 'Semana' },
  { id: 'month', label: 'Mês' },
  { id: 'custom', label: 'Personalizado' },
];

const SORT_OPTIONS = [
  { id: 'date-desc', label: 'Data (Mais recente)' },
  { id: 'date-asc', label: 'Data (Mais antigo)' },
  { id: 'value-desc', label: 'Valor (Maior)' },
  { id: 'value-asc', label: 'Valor (Menor)' },
];

export default function Reports() {
  const [sales, setSales] = useState([]);
  const [filteredSales, setFilteredSales] = useState([]);
  const [settings, setSettings] = useState({ commissionRate: 0.1 });
  const [refreshing, setRefreshing] = useState(false);
  
  // Filter states
  const [selectedPeriod, setSelectedPeriod] = useState('all');
  const [customStartDate, setCustomStartDate] = useState(null);
  const [customEndDate, setCustomEndDate] = useState(null);
  const [selectedSort, setSelectedSort] = useState('date-desc');
  const [showFilters, setShowFilters] = useState(false);
  
  // Stats
  const [stats, setStats] = useState({
    totalSales: 0,
    totalCommission: 0,
    averageSale: 0,
    count: 0,
  });

  const loadData = async () => {
    try {
      const [salesData, settingsData] = await Promise.all([
        getSales(),
        getSettings(),
      ]);
      
      setSales(salesData);
      setSettings(settingsData);
    } catch (error) {
      console.error('Error loading data:', error);
    }
  };

  const applyFilters = useCallback(() => {
    let filtered = [...sales];
    
    // Apply period filter
    if (selectedPeriod !== 'all') {
      const today = new Date();
      const startOfToday = new Date(today.getFullYear(), today.getMonth(), today.getDate());
      const startOfWeek = new Date(today);
      startOfWeek.setDate(today.getDate() - today.getDay());
      const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
      
      switch (selectedPeriod) {
        case 'today':
          filtered = filtered.filter(sale => 
            new Date(sale.date) >= startOfToday
          );
          break;
        case 'week':
          filtered = filtered.filter(sale => 
            new Date(sale.date) >= startOfWeek
          );
          break;
        case 'month':
          filtered = filtered.filter(sale => 
            new Date(sale.date) >= startOfMonth
          );
          break;
        case 'custom':
          if (customStartDate || customEndDate) {
            filtered = filtered.filter(sale =>
              isDateInRange(sale.date, customStartDate, customEndDate)
            );
          }
          break;
      }
    }
    
    // Apply sorting
    filtered.sort((a, b) => {
      switch (selectedSort) {
        case 'date-desc':
          return new Date(b.date) - new Date(a.date);
        case 'date-asc':
          return new Date(a.date) - new Date(b.date);
        case 'value-desc':
          return b.value - a.value;
        case 'value-asc':
          return a.value - b.value;
        default:
          return 0;
      }
    });
    
    setFilteredSales(filtered);
    
    // Calculate stats
    const totalSales = filtered.reduce((sum, sale) => sum + sale.value, 0);
    const totalCommission = filtered.reduce((sum, sale) => 
      sum + calculateCommission(sale.value, settings.commissionRate), 0
    );
    
    setStats({
      totalSales,
      totalCommission,
      averageSale: filtered.length > 0 ? totalSales / filtered.length : 0,
      count: filtered.length,
    });
  }, [sales, selectedPeriod, customStartDate, customEndDate, selectedSort, settings.commissionRate]);

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  };

  const handleSalePress = (sale) => {
    Alert.alert(
      'Detalhes da Venda',
      `${sale.jewelryType}\nValor: ${formatCurrency(sale.value)}\nComissão: ${formatCurrency(calculateCommission(sale.value, settings.commissionRate))}\nData: ${new Date(sale.date).toLocaleDateString('pt-BR')}${sale.description ? `\n\n${sale.description}` : ''}`,
      [{ text: 'OK' }]
    );
  };

  const clearFilters = () => {
    setSelectedPeriod('all');
    setCustomStartDate(null);
    setCustomEndDate(null);
    setSelectedSort('date-desc');
  };

  useFocusEffect(
    useCallback(() => {
      loadData();
    }, [])
  );

  useEffect(() => {
    applyFilters();
  }, [applyFilters]);

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />
      
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.filterButton}
          onPress={() => setShowFilters(!showFilters)}
        >
          <Ionicons 
            name={showFilters ? "filter" : "filter-outline"} 
            size={20} 
            color="#6366f1" 
          />
          <Text style={styles.filterButtonText}>Filtros</Text>
        </TouchableOpacity>
        
        {(selectedPeriod !== 'all' || selectedSort !== 'date-desc') && (
          <TouchableOpacity onPress={clearFilters}>
            <Text style={styles.clearFilters}>Limpar</Text>
          </TouchableOpacity>
        )}
      </View>

      {showFilters && (
        <Card style={styles.filtersCard}>
          <Text style={styles.filtersTitle}>Período</Text>
          <View style={styles.filterOptions}>
            {FILTER_PERIODS.map((period) => (
              <TouchableOpacity
                key={period.id}
                style={[
                  styles.filterOption,
                  selectedPeriod === period.id && styles.filterOptionActive
                ]}
                onPress={() => setSelectedPeriod(period.id)}
              >
                <Text style={[
                  styles.filterOptionText,
                  selectedPeriod === period.id && styles.filterOptionTextActive
                ]}>
                  {period.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
          
          {selectedPeriod === 'custom' && (
            <DateRangePicker
              startDate={customStartDate}
              endDate={customEndDate}
              onStartDateChange={setCustomStartDate}
              onEndDateChange={setCustomEndDate}
              style={styles.dateRange}
            />
          )}
          
          <Text style={styles.filtersTitle}>Ordenar por</Text>
          <View style={styles.filterOptions}>
            {SORT_OPTIONS.map((option) => (
              <TouchableOpacity
                key={option.id}
                style={[
                  styles.filterOption,
                  selectedSort === option.id && styles.filterOptionActive
                ]}
                onPress={() => setSelectedSort(option.id)}
              >
                <Text style={[
                  styles.filterOptionText,
                  selectedSort === option.id && styles.filterOptionTextActive
                ]}>
                  {option.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </Card>
      )}

      <ScrollView 
        style={styles.content}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
      >
        <View style={styles.statsContainer}>
          <View style={styles.statsRow}>
            <StatsCard
              title="Vendas"
              value={formatCurrency(stats.totalSales)}
              subtitle={`${stats.count} vendas`}
              gradient={['#667eea', '#764ba2']}
              style={styles.statHalf}
            />
            
            <StatsCard
              title="Comissões"
              value={formatCurrency(stats.totalCommission)}
              subtitle={`${(settings.commissionRate * 100).toFixed(0)}% de taxa`}
              gradient={['#f093fb', '#f5576c']}
              style={styles.statHalf}
            />
          </View>
          
          <StatsCard
            title="Ticket Médio"
            value={formatCurrency(stats.averageSale)}
            subtitle={`Comissão média: ${formatCurrency(stats.averageSale * settings.commissionRate)}`}
            gradient={['#4facfe', '#00f2fe']}
          />
        </View>

        <View style={styles.salesSection}>
          <Text style={styles.sectionTitle}>
            Vendas ({filteredSales.length})
          </Text>
          
          {filteredSales.length === 0 ? (
            <View style={styles.emptyState}>
              <Ionicons name="document-outline" size={48} color="#adb5bd" />
              <Text style={styles.emptyStateTitle}>Nenhuma venda encontrada</Text>
              <Text style={styles.emptyStateSubtitle}>
                {selectedPeriod !== 'all' || selectedSort !== 'date-desc'
                  ? 'Tente ajustar os filtros'
                  : 'Adicione suas primeiras vendas'}
              </Text>
            </View>
          ) : (
            filteredSales.map(sale => (
              <SaleCard
                key={sale.id}
                sale={sale}
                commissionRate={settings.commissionRate}
                onPress={() => handleSalePress(sale)}
              />
            ))
          )}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef',
  },
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#f8f9fa',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#e9ecef',
  },
  filterButtonText: {
    marginLeft: 8,
    fontSize: 14,
    fontWeight: '500',
    color: '#6366f1',
  },
  clearFilters: {
    fontSize: 14,
    color: '#dc3545',
    fontWeight: '500',
  },
  filtersCard: {
    margin: 20,
    marginBottom: 0,
  },
  filtersTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#212529',
    marginBottom: 12,
    marginTop: 8,
  },
  filterOptions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 16,
    marginHorizontal: -4,
  },
  filterOption: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginHorizontal: 4,
    marginVertical: 4,
    backgroundColor: '#f8f9fa',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#e9ecef',
  },
  filterOptionActive: {
    backgroundColor: '#6366f1',
    borderColor: '#6366f1',
  },
  filterOptionText: {
    fontSize: 14,
    color: '#495057',
    fontWeight: '500',
  },
  filterOptionTextActive: {
    color: '#ffffff',
  },
  dateRange: {
    marginBottom: 16,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  statsContainer: {
    paddingTop: 20,
    marginBottom: 24,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  statHalf: {
    flex: 0.48,
    marginBottom: 0,
  },
  salesSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#212529',
    marginBottom: 16,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 48,
  },
  emptyStateTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#495057',
    marginTop: 16,
    marginBottom: 4,
  },
  emptyStateSubtitle: {
    fontSize: 14,
    color: '#6c757d',
    textAlign: 'center',
  },
});
