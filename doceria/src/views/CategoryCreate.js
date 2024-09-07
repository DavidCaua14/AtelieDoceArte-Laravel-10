import React, { useState } from "react";
import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import InputLabel from "../components/InputLabel";
import { addCategory } from "../hooks/Category";
import Loading from "../components/Loading";

const CategoryCreate = () => {
  const [categoryName, setCategoryName] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const navigation = useNavigation();

  const handleCreateCategory = async () => {
    setLoading(true);
    setErrors({});

    try {
      const data = {
        nome: categoryName,
      };
      const response = await addCategory(data);

      if (response.ok) {
        navigation.navigate('Categorias', { successMessage: response.data.message });
      } else {
        if (response.data.errors) {
          setErrors(response.data.errors);
        } else {
          setErrors({ general: [response.data.message || 'Erro desconhecido'] });
        }
      }
    } catch (error) {
      console.error('Erro ao realizar a requisição:', error);
      setErrors({ general: [error.message] });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollViewContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.inputContainer}>
          {/* Alerta de Erro */}
          {Object.keys(errors).length > 0 && (
            <View style={styles.alert}>
              {Object.keys(errors).map((key) => (
                <Text key={key} style={styles.alertText}>
                  {errors[key].join(', ')}
                </Text>
              ))}
            </View>
          )}

          <InputLabel
            type="text"
            placeholder="Nome da Categoria"
            value={categoryName}
            onChangeText={setCategoryName}
          />
        </View>

        <TouchableOpacity style={styles.createButton} onPress={handleCreateCategory}>
          <Text style={styles.createButtonText}>Cadastrar</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollViewContent: {
    flexGrow: 1,
    padding: 20,
    justifyContent: 'space-between',
  },
  inputContainer: {
    marginBottom: 30,
  },
  createButton: {
    backgroundColor: '#ff6f61',
    paddingVertical: 12,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 20,
  },
  createButtonText: {
    color: 'white',
    fontSize: 16,
  },
  alert: {
    backgroundColor: '#f8d7da',
    padding: 10,
    borderRadius: 5,
    marginBottom: 15,
    width: '100%',
    alignItems: 'center',
  },
  alertText: {
    color: '#721c24',
  },
});

export default CategoryCreate;