import React, { useState, useEffect, useCallback } from "react";
import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons'; 
import { useNavigation, useRoute, useFocusEffect } from '@react-navigation/native';
import { getCategories } from '../hooks/Category';
import Loading from "../components/Loading";

const CategoryList = () => {
  const [categories, setCategories] = useState([]);
  const [successMessage, setSuccessMessage] = useState('');
  const navigation = useNavigation();
  const route = useRoute();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (route.params?.successMessage) {
      setSuccessMessage(route.params.successMessage);
    }
  }, [route.params?.successMessage]);

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const response = await getCategories();
      if (response.ok) {
        setCategories(response.data);
        setLoading(false);
      } else {
        console.log('Erro ao buscar categorias:', response.data);
        setLoading(false);
      }
    } catch (error) {
      console.error('Erro ao realizar a requisição:', error);
      setLoading(false);
    }
  };
    
  const handleAddCategory = () => {
    navigation.navigate('Cadastrar Categoria');
  };

  const handleEditCategory = (category) => {
    navigation.navigate('Editar Categoria', { categoryId: category.id });
  };
  
  useFocusEffect(
    useCallback(() => {
      fetchCategories();
    }, [])
  );

  if (loading) {
    return <Loading />;
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView 
        contentContainerStyle={styles.scrollViewContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Alerta de Sucesso */}
        {successMessage ? (
          <View style={styles.successAlert}>
            <Text style={styles.successText}>{successMessage}</Text>
          </View>
        ) : null}

        <View style={styles.categoryList}>
          {categories.map((category) => (
            <TouchableOpacity
              key={category.id}
              style={styles.categoryItem}
              onPress={() => handleEditCategory(category)}
            >
              <Text style={styles.categoryText}>{category.nome}</Text>
              <Ionicons name="chevron-forward-outline" size={20} color="#FF6347" />
            </TouchableOpacity>
          ))}
        </View>

        <TouchableOpacity style={styles.addButton} onPress={handleAddCategory}>
          <Ionicons name="add-circle-outline" size={24} color="white" />
          <Text style={styles.addButtonText}>Adicionar Nova Categoria</Text>
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
  },
  successAlert: {
    backgroundColor: '#d4edda',
    padding: 10,
    borderRadius: 5,
    borderColor: '#c3e6cb',
    borderWidth: 1,
    marginBottom: 20, 
  },
  successText: {
    color: '#155724',
  },
  categoryList: {
    marginBottom: 30,
  },
  categoryItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
    borderColor: '#ff6f61',
    borderWidth: 1,
  },
  categoryText: {
    fontSize: 18,
    color: '#333333',
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ff6f61',
    paddingVertical: 12,
    borderRadius: 5,
  },
  addButtonText: {
    color: 'white',
    fontSize: 16,
    marginLeft: 8,
  },
});

export default CategoryList;