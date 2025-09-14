import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  Alert,
  Switch,
  TouchableOpacity 
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Button, Input, Card } from '../../components';
import { getSettings, saveSettings } from '../../utils/storage';
import { useTheme } from '../../utils/ThemeContext';

export default function Settings() {
  const { theme, setTheme, themes } = useTheme();
  const [commissionRate, setCommissionRate] = useState('10');
  const [loading, setLoading] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  
  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const settings = await getSettings();
      setCommissionRate((settings.commissionRate * 100).toString());
    } catch (error) {
      console.error('Error loading settings:', error);
    }
  };

  const handleSaveSettings = async () => {
    const rate = parseFloat(commissionRate.replace(',', '.'));
    
    if (isNaN(rate) || rate < 0 || rate > 100) {
      Alert.alert('Erro', 'Taxa de comissão deve ser um número entre 0 e 100.');
      return;
    }
    
    setLoading(true);
    
    try {
      await saveSettings({
        commissionRate: rate / 100,
        darkMode: isDarkMode,
      });
      
      Alert.alert('Sucesso', 'Configurações salvas com sucesso!');
    } catch (error) {
      console.error('Error saving settings:', error);
      Alert.alert('Erro', 'Não foi possível salvar as configurações.');
    } finally {
      setLoading(false);
    }
  };

  const resetSettings = () => {
    Alert.alert(
      'Resetar Configurações',
      'Tem certeza que deseja resetar todas as configurações para os valores padrão?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Resetar',
          style: 'destructive',
          onPress: () => {
            setCommissionRate('10');
            setIsDarkMode(false);
          }
        }
      ]
    );
  };

  const aboutApp = () => {
    Alert.alert(
      'Sobre o App',
      'Comissões de Joias v1.0\n\nApp desenvolvido para calcular comissões de vendas de joias de forma simples e elegante.\n\n© 2024',
      [{ text: 'OK' }]
    );
  };

  const dynamicStyles = createStyles(theme);
  
  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]} edges={['bottom']}>
      <StatusBar style={theme.id === 'dark' ? "light" : "dark"} />
      
      <ScrollView style={styles.content}>
        <Card style={[styles.section, { backgroundColor: theme.colors.surface }]}>
          <View style={styles.sectionHeader}>
            <Ionicons name="color-palette" size={24} color={theme.colors.primary} />
            <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>Temas</Text>
          </View>
          
          <View style={styles.themesGrid}>
            {Object.values(themes).map((themeOption) => (
              <TouchableOpacity
                key={themeOption.id}
                style={[
                  styles.themeOption,
                  { 
                    borderColor: theme.id === themeOption.id ? theme.colors.primary : theme.colors.border,
                    backgroundColor: themeOption.colors.surface,
                  }
                ]}
                onPress={() => setTheme(themeOption.id)}
              >
                <View 
                  style={[
                    styles.themePreview,
                    { backgroundColor: themeOption.colors.primary }
                  ]}
                />
                <Text 
                  style={[
                    styles.themeName,
                    { 
                      color: theme.id === themeOption.id ? theme.colors.primary : theme.colors.text,
                      fontWeight: theme.id === themeOption.id ? '600' : '500'
                    }
                  ]}
                >
                  {themeOption.name}
                </Text>
                {theme.id === themeOption.id && (
                  <Ionicons 
                    name="checkmark-circle" 
                    size={20} 
                    color={theme.colors.primary} 
                    style={styles.themeCheck}
                  />
                )}
              </TouchableOpacity>
            ))}
          </View>
        </Card>

        <Card style={[styles.section, { backgroundColor: theme.colors.surface }]}>
          <View style={styles.sectionHeader}>
            <Ionicons name="calculator" size={24} color={theme.colors.primary} />
            <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>Comissão</Text>
          </View>
          
          <Input
            label="Taxa de Comissão (%)"
            value={commissionRate}
            onChangeText={(text) => setCommissionRate(text.replace(/[^0-9,.]/, ''))}
            placeholder="10"
            keyboardType="numeric"
            leftIcon="percent"
          />
          
          <Text style={styles.helperText}>
            Defina a porcentagem de comissão que você recebe sobre cada venda.
          </Text>
        </Card>

        <Card style={styles.section}>
          <View style={styles.sectionHeader}>
            <Ionicons name="settings" size={24} color="#6366f1" />
            <Text style={styles.sectionTitle}>Preferências</Text>
          </View>
          
          <View style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <Text style={styles.settingLabel}>Modo Escuro</Text>
              <Text style={styles.settingDescription}>
                Ative o tema escuro (em desenvolvimento)
              </Text>
            </View>
            <Switch
              value={isDarkMode}
              onValueChange={setIsDarkMode}
              trackColor={{ false: '#e9ecef', true: '#6366f1' }}
              thumbColor="#ffffff"
              disabled={true}
            />
          </View>
        </Card>

        <Card style={styles.section}>
          <View style={styles.sectionHeader}>
            <Ionicons name="information-circle" size={24} color="#6366f1" />
            <Text style={styles.sectionTitle}>Informações</Text>
          </View>
          
          <TouchableOpacity style={styles.menuItem} onPress={aboutApp}>
            <View style={styles.menuItemContent}>
              <Ionicons name="information" size={20} color="#6c757d" />
              <Text style={styles.menuItemText}>Sobre o App</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#6c757d" />
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.menuItem}>
            <View style={styles.menuItemContent}>
              <Ionicons name="help-circle" size={20} color="#6c757d" />
              <Text style={styles.menuItemText}>Ajuda</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#6c757d" />
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.menuItem}>
            <View style={styles.menuItemContent}>
              <Ionicons name="star" size={20} color="#6c757d" />
              <Text style={styles.menuItemText}>Avaliar App</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#6c757d" />
          </TouchableOpacity>
        </Card>

        <View style={styles.actions}>
          <Button
            title="Salvar Configurações"
            onPress={handleSaveSettings}
            disabled={loading}
            style={styles.saveButton}
          />
          
          <Button
            title="Resetar"
            variant="outline"
            onPress={resetSettings}
            style={styles.resetButton}
          />
        </View>
      </ScrollView>
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
    paddingTop: 20,
  },
  section: {
    marginBottom: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#212529',
    marginLeft: 12,
  },
  helperText: {
    fontSize: 14,
    color: '#6c757d',
    marginTop: 8,
    lineHeight: 20,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
  },
  settingInfo: {
    flex: 1,
  },
  settingLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: '#212529',
    marginBottom: 2,
  },
  settingDescription: {
    fontSize: 14,
    color: '#6c757d',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f3f4',
  },
  menuItemContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  menuItemText: {
    fontSize: 16,
    color: '#495057',
    marginLeft: 12,
  },
  actions: {
    marginTop: 8,
    marginBottom: 32,
  },
  saveButton: {
    marginBottom: 12,
  },
  resetButton: {
    borderColor: '#dc3545',
  },
  
  // Theme styles
  themesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -8,
  },
  themeOption: {
    width: '47%',
    margin: 4,
    padding: 16,
    borderRadius: 12,
    borderWidth: 2,
    alignItems: 'center',
    minHeight: 100,
  },
  themePreview: {
    width: 32,
    height: 32,
    borderRadius: 16,
    marginBottom: 8,
  },
  themeName: {
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 4,
  },
  themeCheck: {
    position: 'absolute',
    top: 8,
    right: 8,
  },
});

const createStyles = (theme) => StyleSheet.create({
  // Dynamic styles based on theme can be added here if needed
});
