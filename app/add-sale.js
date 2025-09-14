import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  Alert,
  KeyboardAvoidingView,
  Platform 
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Button, Input, DatePicker } from '../components';
import { saveSale, updateSale, getSales } from '../utils/storage';

const jewelryTypes = [
  'Anel',
  'Colar',
  'Pulseira',
  'Brinco',
  'Pingente',
  'Corrente',
  'Aliança',
  'Broche',
  'Outros'
];

export default function AddSale() {
  const [formData, setFormData] = useState({
    jewelryType: '',
    value: '',
    date: new Date(),
    description: '',
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  
  const router = useRouter();
  const { id } = useLocalSearchParams();

  useEffect(() => {
    if (id) {
      loadSaleData(id);
    }
  }, [id]);

  const loadSaleData = async (saleId) => {
    try {
      const sales = await getSales();
      const sale = sales.find(s => s.id === saleId);
      
      if (sale) {
        setFormData({
          jewelryType: sale.jewelryType,
          value: sale.value.toString(),
          date: new Date(sale.date),
          description: sale.description || '',
        });
        setIsEditing(true);
      }
    } catch (error) {
      console.error('Error loading sale:', error);
      Alert.alert('Erro', 'Não foi possível carregar os dados da venda.');
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.jewelryType.trim()) {
      newErrors.jewelryType = 'Tipo de joia é obrigatório';
    }
    
    if (!formData.value.trim()) {
      newErrors.value = 'Valor é obrigatório';
    } else {
      const value = parseFloat(formData.value.replace(',', '.'));
      if (isNaN(value) || value <= 0) {
        newErrors.value = 'Valor deve ser um número positivo';
      }
    }
    
    if (!formData.date) {
      newErrors.date = 'Data é obrigatória';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validateForm()) return;
    
    setLoading(true);
    
    try {
      const value = parseFloat(formData.value.replace(',', '.'));
      const saleData = {
        jewelryType: formData.jewelryType.trim(),
        value: value,
        date: formData.date.toISOString(),
        description: formData.description.trim(),
      };

      if (isEditing) {
        await updateSale(id, saleData);
        Alert.alert('Sucesso', 'Venda atualizada com sucesso!');
      } else {
        await saveSale(saleData);
        Alert.alert('Sucesso', 'Venda adicionada com sucesso!');
      }
      
      router.back();
    } catch (error) {
      console.error('Error saving sale:', error);
      Alert.alert('Erro', 'Não foi possível salvar a venda.');
    } finally {
      setLoading(false);
    }
  };

  const handleValueChange = (text) => {
    // Format value input - allow only numbers, comma, and dot
    const cleanText = text.replace(/[^0-9,.]/, '');
    setFormData({ ...formData, value: cleanText });
    
    if (errors.value) {
      setErrors({ ...errors, value: '' });
    }
  };

  return (
    <KeyboardAvoidingView 
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <StatusBar style="dark" />
      
      <ScrollView 
        style={styles.content}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.form}>
          <Input
            label="Tipo de Joia"
            value={formData.jewelryType}
            onChangeText={(text) => {
              setFormData({ ...formData, jewelryType: text });
              if (errors.jewelryType) {
                setErrors({ ...errors, jewelryType: '' });
              }
            }}
            placeholder="Ex: Anel, Colar, Pulseira..."
            leftIcon="diamond-outline"
            error={errors.jewelryType}
          />

          <Input
            label="Valor da Venda"
            value={formData.value}
            onChangeText={handleValueChange}
            placeholder="0,00"
            keyboardType="numeric"
            leftIcon="cash-outline"
            error={errors.value}
          />

          <DatePicker
            label="Data da Venda"
            value={formData.date}
            onDateChange={(date) => {
              setFormData({ ...formData, date });
              if (errors.date) {
                setErrors({ ...errors, date: '' });
              }
            }}
            maximumDate={new Date()}
          />

          <Input
            label="Descrição (Opcional)"
            value={formData.description}
            onChangeText={(text) => setFormData({ ...formData, description: text })}
            placeholder="Detalhes adicionais sobre a venda..."
            multiline
            numberOfLines={3}
            leftIcon="document-text-outline"
          />
        </View>
        
        <View style={styles.suggestions}>
          <Text style={styles.suggestionsTitle}>Sugestões:</Text>
          <View style={styles.suggestionTags}>
            {jewelryTypes.map((type) => (
              <Button
                key={type}
                title={type}
                variant="outline"
                size="small"
                style={styles.suggestionTag}
                onPress={() => {
                  setFormData({ ...formData, jewelryType: type });
                  if (errors.jewelryType) {
                    setErrors({ ...errors, jewelryType: '' });
                  }
                }}
              />
            ))}
          </View>
        </View>
      </ScrollView>

      <View style={styles.actions}>
        <Button
          title="Cancelar"
          variant="secondary"
          onPress={router.back}
          style={styles.actionButton}
        />
        <Button
          title={isEditing ? 'Atualizar' : 'Salvar'}
          onPress={handleSave}
          disabled={loading}
          style={styles.actionButton}
        />
      </View>
    </KeyboardAvoidingView>
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
  form: {
    marginTop: 20,
  },
  suggestions: {
    marginTop: 24,
    marginBottom: 20,
  },
  suggestionsTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#495057',
    marginBottom: 12,
  },
  suggestionTags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -4,
  },
  suggestionTag: {
    margin: 4,
    paddingHorizontal: 12,
    paddingVertical: 6,
    minHeight: 32,
  },
  actions: {
    flexDirection: 'row',
    padding: 20,
    paddingTop: 16,
    backgroundColor: '#ffffff',
    borderTopWidth: 1,
    borderTopColor: '#e9ecef',
  },
  actionButton: {
    flex: 1,
    marginHorizontal: 8,
  },
});
