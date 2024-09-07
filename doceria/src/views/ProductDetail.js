import React, { useEffect, useState } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import { getProduct } from '../hooks/Product';
import { WS_URL } from '../../Config';
import Loading from '../components/Loading';

const ProductDetail = () => {
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();
  const route = useRoute();
  const { productId } = route.params || {};

  useEffect(() => {
    const fetchProductDetails = async () => {
      try {
        const response = await getProduct(productId);
        if (response.ok) {
          setProduct(response.data);
        } else {
          Alert.alert('Erro', 'Não foi possível carregar os detalhes do produto.');
        }
      } catch (error) {
        console.error('Erro ao buscar detalhes do produto:', error);
        Alert.alert('Erro', 'Ocorreu um erro ao tentar buscar os detalhes do produto.');
      } finally {
        setLoading(false);
      }
    };

    fetchProductDetails();
  }, [productId]);

  if (loading) {
    return <Loading />;
  }

  if (!product) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.errorText}>Produto não encontrado.</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        <View style={styles.card}>
          <Image
            source={{ uri: `${WS_URL}/storage/${product.imagem}` }}
            style={styles.productImage}
          />
          <View style={styles.detailsContainer}>
            <Text style={styles.productName}>{product.nome}</Text>
            <Text style={styles.productDescription}>{product.descricao}</Text>
            <Text style={styles.productPrice}>
              R$ {parseFloat(product.preco).toFixed(2)}
            </Text>
          </View>

          <TouchableOpacity style={styles.buyButton}>
            <Ionicons name="cart-outline" size={24} color="#fff" />
            <Text style={styles.buyButtonText}>Comprar</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFAF3',
  },
  scrollViewContent: {
    padding: 16,
    alignItems: 'center',
  },
  errorText: {
    fontSize: 18,
    color: '#d9534f',
    textAlign: 'center',
    marginTop: 20,
  },
  card: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
    padding: 20,
    alignItems: 'center',
  },
  productImage: {
    width: '100%',
    height: 250,
    borderRadius: 15,
    marginBottom: 20,
  },
  detailsContainer: {
    width: '100%',
    alignItems: 'center',
  },
  productName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#B22222',
    textAlign: 'center',
    marginBottom: 8,
  },
  productDescription: {
    fontSize: 16,
    color: '#6C757D',
    textAlign: 'center',
    marginBottom: 12,
  },
  productPrice: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#32CD32',
    marginBottom: 20,
  },
  buyButton: {
    flexDirection: 'row',
    backgroundColor: '#FF6347',
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
    elevation: 3,
  },
  buyButtonText: {
    color: '#fff',
    fontSize: 16,
    marginLeft: 8,
  },
});

export default ProductDetail;