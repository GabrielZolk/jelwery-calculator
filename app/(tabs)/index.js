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
import { useFocusEffect, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { StatsCard, SaleCard } from '../../components';
import { getSales, getSettings, deleteSale } from '../../utils/storage';
import { formatCurrency, getDateRanges, calculateCommission } from '../../utils/helpers';
import { useTheme } from '../../utils/ThemeContext';

export default function Dashboard() {
  const { theme } = useTheme();
  const [sales, setSales] = useState([]);
  const [settings, setSettings] = useState({ commissionRate: 0.1 });
  const [refreshing, setRefreshing] = useState(false);
  const [stats, setStats] = useState({
    today: { sales: 0, commission: 0, count: 0 },
    thisWeek: { sales: 0, commission: 0, count: 0 },
    thisMonth: { sales: 0, commission: 0, count: 0 },
    total: { sales: 0, commission: 0, count: 0 },
  });
  
  const router = useRouter();
  const dateRanges = getDateRanges();

  const loadData = async () => {
    try {
      const [salesData, settingsData] = await Promise.all([
        getSales(),
        getSettings(),
      ]);
      
      setSales(salesData);
      setSettings(settingsData);
      calculateStats(salesData, settingsData.commissionRate);
    } catch (error) {
      console.error('Error loading data:', error);
    }
  };

  const calculateStats = (salesData, commissionRate) => {
    const newStats = {
      today: { sales: 0, commission: 0, count: 0 },
      thisWeek: { sales: 0, commission: 0, count: 0 },
      thisMonth: { sales: 0, commission: 0, count: 0 },
      total: { sales: 0, commission: 0, count: 0 },
    };

    salesData.forEach(sale => {
      const saleDate = new Date(sale.date);
      const commission = calculateCommission(sale.value, commissionRate);
      
      // Total
      newStats.total.sales += sale.value;
      newStats.total.commission += commission;
      newStats.total.count += 1;
      
      // Today
      if (saleDate >= dateRanges.today.start) {
        newStats.today.sales += sale.value;
        newStats.today.commission += commission;
        newStats.today.count += 1;
      }
      
      // This week
      if (saleDate >= dateRanges.thisWeek.start) {
        newStats.thisWeek.sales += sale.value;
        newStats.thisWeek.commission += commission;
        newStats.thisWeek.count += 1;
      }
      
      // This month
      if (saleDate >= dateRanges.thisMonth.start) {
        newStats.thisMonth.sales += sale.value;
        newStats.thisMonth.commission += commission;
        newStats.thisMonth.count += 1;
      }
    });

    setStats(newStats);
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  };

  const handleAddSale = () => {
    router.push('/add-sale');
  };

  const handleSalePress = (sale) => {
    Alert.alert(
      'Opções da Venda',
      `${sale.jewelryType} - ${formatCurrency(sale.value)}`,
      [
        { text: 'Cancelar', style: 'cancel' },
        { 
          text: 'Editar', 
          onPress: () => router.push(`/add-sale?id=${sale.id}`) 
        },
        {
          text: 'Excluir',
          style: 'destructive',
          onPress: () => handleDeleteSale(sale.id),
        },
      ]
    );
  };

  const handleDeleteSale = async (saleId) => {
    try {
      await deleteSale(saleId);
      await loadData();
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível excluir a venda.');
    }
  };

  useFocusEffect(
    useCallback(() => {
      loadData();
    }, [])
  );

  const recentSales = sales.slice(0, 5);

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]} edges={['bottom']}>
      <StatusBar style={theme.id === 'dark' ? "light" : "dark"} />
      
      <ScrollView 
        style={styles.content}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
      >
        <View style={styles.header}>
          <Text style={[styles.welcome, { color: theme.colors.text }]}>Olá! 👋</Text>
          <Text style={[styles.subtitle, { color: theme.colors.textSecondary }]}>Vamos ver suas vendas</Text>
        </View>

        <View style={styles.statsContainer}>
          <StatsCard
            title="Hoje"
            value={formatCurrency(stats.today.commission)}
            subtitle={`${stats.today.count} vendas`}
            gradient={theme.gradients.primary}
          />
          
          <StatsCard
            title="Esta Semana"
            value={formatCurrency(stats.thisWeek.commission)}
            subtitle={`${stats.thisWeek.count} vendas`}
            gradient={theme.gradients.secondary}
          />
          
          <StatsCard
            title="Este Mês"
            value={formatCurrency(stats.thisMonth.commission)}
            subtitle={`${stats.thisMonth.count} vendas`}
            gradient={theme.gradients.tertiary}
          />
          
          <StatsCard
            title="Total Geral"
            value={formatCurrency(stats.total.commission)}
            subtitle={`${stats.total.count} vendas • ${formatCurrency(stats.total.sales)} em vendas`}
            gradient={theme.gradients.success}
          />
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>Vendas Recentes</Text>
            {sales.length > 5 && (
              <TouchableOpacity onPress={() => router.push('/reports')}>
                <Text style={[styles.seeAll, { color: theme.colors.primary }]}>Ver todas</Text>
              </TouchableOpacity>
            )}
          </View>
          
          {recentSales.length === 0 ? (
            <View style={styles.emptyState}>
              <Ionicons name="diamond-outline" size={48} color={theme.colors.textSecondary} />
              <Text style={[styles.emptyStateTitle, { color: theme.colors.text }]}>Nenhuma venda ainda</Text>
              <Text style={[styles.emptyStateSubtitle, { color: theme.colors.textSecondary }]}>
                Adicione sua primeira venda para começar
              </Text>
            </View>
          ) : (
            recentSales.map(sale => (
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

      <TouchableOpacity 
        style={[
          styles.fab,
          { 
            backgroundColor: theme.colors.primary,
            shadowColor: theme.colors.primary,
          }
        ]} 
        onPress={handleAddSale}
        activeOpacity={0.8}
      >
        <Ionicons name="add" size={28} color="#ffffff" />
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  header: {
    marginTop: 20,
    marginBottom: 24,
  },
  welcome: {
    fontSize: 28,
    fontWeight: '700',
    color: '#212529',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: '#6c757d',
  },
  statsContainer: {
    marginBottom: 32,
  },
  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#212529',
  },
  seeAll: {
    fontSize: 16,
    color: '#6366f1',
    fontWeight: '500',
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
  fab: {
    position: 'absolute',
    bottom: 24,
    right: 24,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#6366f1',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#6366f1',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
});
