import React, { useState, useEffect } from "react";
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Image, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons'; 
import * as ImagePicker from 'expo-image-picker';
import InputLabel from "../components/InputLabel";
import { getCategories } from '../hooks/Category'; 
import { addProduct } from "../hooks/Product";
import { useNavigation } from '@react-navigation/native';
import Loading from "../components/Loading";

const ProductCreate = () => {
  const [imageUri, setImageUri] = useState(null);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [categories, setCategories] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const navigation = useNavigation();
  const [loading, setLoading] = useState(true);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    setLoading(true);
    async function fetchCategories() {
      const response = await getCategories();
      if (response && Array.isArray(response.data)) {
        const formattedCategories = response.data.map(category => ({
          id: category.id,
          label: category.nome,
          checked: false,
        }));
        setCategories(formattedCategories);
        setLoading(false);
      } else {
        console.error("Resposta de categorias não é um array:", response);
        setLoading(false);
      }
    }
    fetchCategories();
  }, []);

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
  
    if (!imageUri) {
      validationErrors.imagem = ['O campo imagem é obrigatório.'];
    }
  
    const selectedCategories = categories.filter(category => category.checked);
    if (selectedCategories.length === 0) {
      validationErrors.categorias = ['Selecione pelo menos uma categoria.'];
    }
  
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
  
    const formData = new FormData();
    formData.append('nome', name);
    formData.append('descricao', description);
    formData.append('preco', numericPrice);
    formData.append('imagem', {
      uri: imageUri,
      type: 'image/jpeg',
      name: imageUri.split('/').pop(),
    });
  
    selectedCategories.forEach(category => {
      formData.append('categorias[]', category.id);
    });
  
    try {
      setLoading(true);
      const response = await addProduct(formData);
      if (response.ok) {
        navigation.navigate('Produtos', { successMessage: response.data.message });
        setLoading(false);
      } else {
        if (response.data.errors) {
          setErrors(response.data.errors);
        } else {
          setErrors({ general: [response.data.message || 'Erro desconhecido'] });
        }
        setLoading(false);
      }
    } catch (error) {
      console.error(error);
      Alert.alert('Erro', 'Ocorreu um erro ao tentar cadastrar o produto');
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

            <TouchableOpacity style={styles.addButton} onPress={handleSave}>
              <Text style={styles.addButtonText}>Salvar</Text>
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
    addButton: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#ff6f61',
      paddingVertical: 12,
      borderRadius: 5,
      marginTop: 20,
      marginBottom: 20
    },
    addButtonText: {
      color: 'white',
      fontSize: 16,
      marginLeft: 8,
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

export default ProductCreate;