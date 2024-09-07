import React, { useState, useEffect, useCallback } from "react";
import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons'; 
import { useNavigation, useRoute, useFocusEffect } from '@react-navigation/native';
import { getProducts } from "../hooks/Product";
import Loading from "../components/Loading";

const ProductList = () => {
  const [produtos, setProdutos] = useState([]);
  const [successMessage, setSuccessMessage] = useState('');
  const navigation = useNavigation();
  const route = useRoute();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (route.params?.successMessage) {
      setSuccessMessage(route.params.successMessage);
    }
  }, [route.params?.successMessage]);

  const fetchProdutos = async () => {
    setLoading(true);
    try {
      const response = await getProducts();
      if (response.ok) {
        setProdutos(response.data);
        setLoading(false);
      } else {
        console.log('Erro ao buscar produtos:', response.data);
        setLoading(false);
      }
    } catch (error) {
      console.error('Erro ao realizar a requisição:', error);
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchProdutos();
    }, [])
  );

  const navigateToProductCreate = () => {
    navigation.navigate('Cadastrar Produto');
  };

  const handleEditProduct = (product) => {
    navigation.navigate('Editar Produto', { productId: product.id });
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
        {successMessage ? (
          <View style={styles.successAlert}>
            <Text style={styles.successText}>{successMessage}</Text>
          </View>
        ) : null}

        <View style={styles.productList}>
          {produtos.map((produto) => (
            <TouchableOpacity style={styles.productItem} key={produto.id} onPress={() => handleEditProduct(produto)}>
              <View style={styles.productDetails}>
                <Ionicons name="cube-outline" size={24} color="#FF6347" />
                <Text 
                  style={styles.productText} 
                  numberOfLines={1}
                  ellipsizeMode="tail"
                >
                  {produto.nome}
                </Text>
              </View>
              <Ionicons name="chevron-forward-outline" size={20} color="#FF6347" />
            </TouchableOpacity>
          ))}
        </View>

        <TouchableOpacity style={styles.addButton} onPress={navigateToProductCreate}>
          <Ionicons name="add-circle-outline" size={24} color="white" />
          <Text style={styles.addButtonText}>Adicionar Novo Produto</Text>
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
  productList: {
    marginBottom: 30,
  },
  productItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#f9f9f9',
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
    borderColor: '#ff6f61',
    borderWidth: 1,
  },
  productDetails: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  productText: {
    fontSize: 18,
    color: '#333',
    marginLeft: 10,
    flexShrink: 1,
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
  }
});

export default ProductList;