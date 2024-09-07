import React, { useState, useCallback } from "react";
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { getCategories } from '../hooks/Category';
import { getProducts } from "../hooks/Product";
import { WS_URL } from "../../Config";
import Loading from "../components/Loading";

const Home = () => {
  const navigation = useNavigation();
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedCategoryName, setSelectedCategoryName] = useState('');
  const [loading, setLoading] = useState(true);

  const fetchCategories = useCallback(async () => {
    setLoading(true);
      try {
          const response = await getCategories();
          if (response && Array.isArray(response.data)) {
              setCategories(response.data);
              setLoading(false);
          } else {
              console.error("Resposta de categorias não é um array:", response);
              setLoading(false);
          }
      } catch (error) {
          console.error("Erro ao buscar categorias:", error);
          setLoading(false);
      }
  }, []);

  const fetchProducts = useCallback(async (categoryId = null) => {
    setLoading(true);
      try {
          const response = await getProducts(categoryId);
          if (response && Array.isArray(response.data)) {
              setProducts(response.data);
              setLoading(false);
          } else {
              setProducts([]); 
              console.error("Erro ao obter produtos:", response);
              setLoading(false);
          }
      } catch (error) {
          setProducts([]); 
          console.error("Erro ao buscar produtos:", error);
          setLoading(false);
      }
  }, []);

  useFocusEffect(
    useCallback(() => {
        fetchCategories();
        fetchProducts(null);
        setSelectedCategory(null);
        setSelectedCategoryName('');
    }, [fetchCategories, fetchProducts])
);

  const handleCategoryPress = (categoryId, categoryName) => {
      setSelectedCategory(categoryId);
      setSelectedCategoryName(categoryName);
      fetchProducts(categoryId);
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
        <View style={styles.header}>
            <Text style={styles.title}>Bem-vindo ao Ateliê Doce e Arte!</Text>
            <Text style={styles.subtitle}>Descubra nossas categorias e produtos</Text>
        </View>
        
        <View style={styles.categoryContainer}>
            {categories.length > 0 ? (
                categories.map((category) => (
                    <View key={category.id} style={styles.categoryWrapper}>
                        <TouchableOpacity 
                            style={styles.categoryButton} 
                            onPress={() => handleCategoryPress(category.id, category.nome)}
                        >
                            <View style={styles.categoryContent}>
                                <MaterialCommunityIcons name="cake" size={30} color="#ffffff" style={styles.categoryIcon} />
                                <Text style={styles.categoryText}>{category.nome}</Text>
                            </View>
                        </TouchableOpacity>
                    </View>
                ))
            ) : (
                <Text style={styles.noCategoriesText}>Nenhuma categoria disponível</Text>
            )}
        </View>

        {selectedCategory && selectedCategoryName && (
            <Text style={styles.selectedCategoryTitle}>Busca por: {selectedCategoryName}</Text>
        )}


        <View style={styles.productContainer}>
            {products.length > 0 ? (
                products.map((product) => (
                    <View key={product.id} style={styles.productCard}>
                        <Image
                            source={{ uri: `${WS_URL}/storage/${product.imagem}` }}
                            style={styles.productImage}
                        />
                        <View style={styles.productDetails}>
                            <Text style={styles.productName}>{product.nome}</Text>
                            <Text style={styles.productDescription}>{product.descricao}</Text>
                            <Text style={styles.productPrice}>R$ {product.preco}</Text>
                            <TouchableOpacity 
                                style={styles.detailsButton} 
                                onPress={() => navigation.navigate('Detalhes', { productId: product.id })}
                            >
                                <Text style={styles.detailsButtonText}>Detalhes</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                ))
            ) : (
                <Text style={styles.noCategoriesText}>Nenhum produto encontrado para esta categoria</Text>
            )}
        </View>
    </ScrollView>
</SafeAreaView>
  );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff0f0',
    },
    scrollViewContent: {
        flexGrow: 1,
        padding: 20,
    },
    header: {
        alignItems: 'center',
        marginBottom: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#ff6f61',
        marginBottom: 10,
    },
    subtitle: {
        fontSize: 16,
        color: '#444',
    },
    categoryContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center',
        marginBottom: 20,
    },
    categoryWrapper: {
        width: '50%',
        padding: 10,
        alignItems: 'center',
    },
    categoryButton: {
        backgroundColor: '#ff6f61',
        paddingVertical: 20,
        paddingHorizontal: 30,
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
        elevation: 2,
        width: '100%',
        maxWidth: 180,
        height: 80,
    },
    categoryContent: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    categoryIcon: {
        marginRight: 10,
    },
    categoryText: {
        color: '#ffffff',
        fontSize: 16,
        fontWeight: '600',
    },
    noCategoriesText: {
        textAlign: 'center',
        color: '#666',
        fontSize: 16,
    },
    selectedCategoryTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#ff6f61',
        textAlign: 'center',
        marginBottom: 10,
    },
    productContainer: {
        marginTop: 20,
    },
    productCard: {
        backgroundColor: '#fff8f0',
        borderRadius: 10,
        padding: 15,
        marginBottom: 15,
        elevation: 2,
    },
    productImage: {
        width: '100%',
        height: 150,
        borderRadius: 10,
        marginBottom: 10,
    },
    productDetails: {
        alignItems: 'center',
    },
    productName: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
    },
    productDescription: {
        fontSize: 14,
        color: '#666',
        marginVertical: 5,
        textAlign: 'center',
    },
    productPrice: {
        fontSize: 16,
        color: '#ff6f61',
        marginVertical: 5,
    },
    detailsButton: {
        backgroundColor: '#ff6f61',
        paddingVertical: 8,
        paddingHorizontal: 20,
        borderRadius: 5,
        marginTop: 10,
    },
    detailsButtonText: {
        color: '#ffffff',
        fontSize: 14,
        fontWeight: '600',
    },
});

export default Home;