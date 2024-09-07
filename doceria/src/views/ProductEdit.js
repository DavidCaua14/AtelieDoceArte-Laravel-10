import React, { useState, useEffect, useRef } from "react";
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Image, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons'; 
import * as ImagePicker from 'expo-image-picker';
import InputLabel from "../components/InputLabel";
import { getCategories } from '../hooks/Category'; 
import { putProducts, getProduct } from "../hooks/Product";
import { useNavigation, useRoute } from '@react-navigation/native';
import { WS_URL } from "../../Config";
import { deleteProduct } from "../hooks/Product";
import Dialog from 'react-native-dialog';
import Loading from "../components/Loading";

const ProductEdit = () => {
    const [imageUri, setImageUri] = useState(null);
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [price, setPrice] = useState('');
    const [categories, setCategories] = useState([]);
    const [errors, setErrors] = useState({});
    const [isDialogVisible, setDialogVisible] = useState(false);
    const navigation = useNavigation();
    const route = useRoute();
    const { productId } = route.params || {}; 
    const [loading, setLoading] = useState(true);
    const scrollViewRef = useRef(null);
  
    useEffect(() => {
      async function fetchProductAndCategories() {
        try {
          setLoading(true);
          const allCategoriesResponse = await getCategories();
          if (allCategoriesResponse.ok) {
            const allCategories = allCategoriesResponse.data.map(category => ({
                id: category.id,
                label: category.nome,
                checked: false,
            }));
  
            setCategories(allCategories);
            setLoading(false);
  
            if (productId) {
              const productResponse = await getProduct(productId);
              if (productResponse.ok) {
                const product = productResponse.data;
                setName(product.nome);
                setDescription(product.descricao);
                setPrice(product.preco ? String(product.preco) : '');
                setImageUri(`${WS_URL}/storage/${product.imagem}`); 
  
                const updatedCategories = allCategories.map(category => ({
                  ...category,
                  checked: product.categorias.some(productCategory => productCategory.id === category.id),
                }));
  
                setCategories(updatedCategories);
                setLoading(false);
              } else {
                console.error("Erro ao buscar o produto:", productResponse);
                setLoading(false);
              }
            }
          } else {
            console.error("Erro ao buscar categorias:", allCategoriesResponse);
            setLoading(false);
          }
        } catch (error) {
          console.error("Erro ao buscar dados:", error);
          setLoading(false);
        }
      }
  
      fetchProductAndCategories();
    }, [productId]);
  
    const handleImagePick = async () => {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });
  
      if (!result.canceled) {
        setImageUri(result.assets[0].uri);
      }
    };
  
    const handleCategoryChange = (categoryId) => {
      setCategories(prevCategories =>
        prevCategories.map(category =>
          category.id === categoryId ? { ...category, checked: !category.checked } : category
        )
      );
    };
  
    const handleSave = async () => {
      const numericPrice = price.replace('R$', '').replace(',', '.').trim();
    
      const validationErrors = {};
    
      const selectedCategories = categories.filter(category => category.checked);
      if (selectedCategories.length === 0) {
        validationErrors.categorias = ['Selecione pelo menos uma categoria.'];
      }
    
      if (Object.keys(validationErrors).length > 0) {
        setErrors(validationErrors);
        if (scrollViewRef.current) {
            scrollViewRef.current.scrollTo({ y: 0, animated: true });
        }
        return;
      }
    
      const formData = new FormData();
      formData.append('nome', name);
      formData.append('descricao', description);
      formData.append('preco', numericPrice);
    
      if (imageUri) {
        formData.append('imagem', {
          uri: imageUri,
          type: 'image/jpeg',
          name: imageUri.split('/').pop(),
        });
      }
    
      categories
        .filter(category => category.checked)
        .forEach(category => {
          formData.append('categorias[]', category.id);
        });
    
      try {
        setLoading(true);
        const response = await putProducts(productId, formData);
        if (response.ok) {
          navigation.navigate('Produtos', { successMessage: response.data.message });
        } else {
          setErrors(response.data.errors || { general: [response.data.message || 'Erro desconhecido'] });
        }
      } catch (error) {
        console.error(error);
        Alert.alert('Erro', 'Ocorreu um erro ao tentar atualizar o produto');
      } finally {
        setLoading(false);
      }
    };
    

    const handleDeleteProduct = async () => {
      try {
        setLoading(true);
        const response = await deleteProduct(productId);
        if (response.ok) {
          navigation.navigate('Produtos', { successMessage: 'Produto excluído com sucesso!' });
          setLoading(false);
        } else {
          Alert.alert('Erro', response.data.message || 'Erro ao excluir produto.');
          setLoading(false);
        }
      } catch (error) {
        console.error('Erro ao realizar a requisição:', error);
        Alert.alert('Erro', error.message);
        setLoading(false);
      }
    };

    const showDeleteDialog = () => {
      setDialogVisible(true);
    };

    const handleConfirmDelete = () => {
      setDialogVisible(false);
      handleDeleteProduct();
    };

    const handleCancelDelete = () => {
      setDialogVisible(false);
    };

    if (loading) {
      return <Loading />;
    }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView 
        contentContainerStyle={styles.scrollViewContent}
        showsVerticalScrollIndicator={false}
        ref={scrollViewRef}
      >
        {Object.keys(errors).length > 0 && (
            <View style={styles.alert}>
              {Object.keys(errors).map((key) => (
                <Text key={key} style={styles.alertText}>
                  {errors[key].join(', ')}
                </Text>
              ))}
            </View>
          )}

        <InputLabel type="text" placeholder="Nome" value={name} onChangeText={setName} />
        <View style={styles.containerFoto}>
          <TouchableOpacity style={styles.imageButton} onPress={handleImagePick}>
            <Ionicons name="image-outline" size={24} color="white" />
            <Text style={styles.imageButtonText}>Escolher Imagem</Text>
          </TouchableOpacity>
        </View>

        {imageUri && (
          <View style={styles.imagePreview}>
            <Image source={{ uri: imageUri }} style={styles.image} />
          </View>
        )}

        <InputLabel type="text" placeholder="Descrição" value={description} onChangeText={setDescription} />
        <InputLabel
          type="money"
          placeholder="Preço"
          value={price}
          onChangeText={setPrice}
        />

        <InputLabel
          type="checkbox"
          selectedOptions={categories}
          onOptionChange={handleCategoryChange}
        />

          <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
            <Ionicons name="save-outline" size={20} color="white" />
            <Text style={styles.saveButtonText}>Salvar</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.deleteButton} onPress={showDeleteDialog}>
            <Ionicons name="trash-outline" size={20} color="white" />
            <Text style={styles.deleteButtonText}>Excluir</Text>
          </TouchableOpacity>

          <Dialog.Container visible={isDialogVisible}>
          <View style={styles.dialogContent}>
            <Ionicons name="warning-outline" size={30} color="#ff6f61" style={styles.dialogIcon} />
            <Dialog.Title style={styles.dialogTitle}>Atenção</Dialog.Title>
            <Dialog.Description style={styles.dialogDescription}>
              Você realmente deseja excluir este produto?
            </Dialog.Description>
            <View style={styles.dialogButtons}>
              <Dialog.Button 
                label="Cancelar" 
                onPress={handleCancelDelete} 
                style={styles.dialogButtonCancel} 
              />
              <Dialog.Button 
                label="Excluir" 
                onPress={handleConfirmDelete} 
                style={styles.dialogButtonConfirm} 
              />
            </View>
          </View>
        </Dialog.Container>

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
  imageButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ff6f61',
    paddingVertical: 12,
    borderRadius: 5,
    marginVertical: 20,
    width: 275,
  },
  imageButtonText: {
    color: 'white',
    fontSize: 16,
    marginLeft: 8,
  },
  imagePreview: {
    marginBottom: 20,
    alignItems: 'center',
  },
  image: {
    width: 200,
    height: 200,
    borderRadius: 8,
    borderColor: '#ff6f61',
    borderWidth: 1,
  },
  saveButton: {
    flexDirection: 'row',
    backgroundColor: '#28a745',
    paddingVertical: 12,
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
  },
  saveButtonText: {
    color: 'white',
    fontSize: 16,
    marginLeft: 8,
  },
  deleteButton: {
    flexDirection: 'row',
    backgroundColor: '#d9534f',
    paddingVertical: 12,
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
  },
  deleteButtonText: {
    color: 'white',
    fontSize: 16,
    marginLeft: 8,
  },
  dialogContent: {
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#ffffff',
    borderRadius: 10,
    borderColor: '#e0e0e0',
    borderWidth: 1,
  },
  dialogIcon: {
    marginBottom: 10,
  },
  dialogTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  dialogDescription: {
    fontSize: 16,
    color: '#666',
    marginBottom: 20,
    textAlign: 'center',
  },
  dialogButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  dialogButtonCancel: {
    backgroundColor: '#e0e0e0',
    color: '#333',
  },
  dialogButtonConfirm: {
    backgroundColor: '#ff6f61',
    color: '#ffffff',
  },
  containerFoto:{
    alignItems: 'center'
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

export default ProductEdit;