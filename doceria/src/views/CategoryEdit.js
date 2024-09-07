import React, { useState, useEffect } from "react";
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import InputLabel from "../components/InputLabel";
import Loading from "../components/Loading";
import { getCategory, putCategories, deleteCategory } from "../hooks/Category";
import Dialog from 'react-native-dialog';

const CategoryEdit = () => {
  const [categoryName, setCategoryName] = useState('');
  const [loading, setLoading] = useState(true);
  const [errors, setErrors] = useState({});
  const [isDialogVisible, setDialogVisible] = useState(false);
  const navigation = useNavigation();
  const route = useRoute();
  const categoryId = route.params?.categoryId;

  useEffect(() => {
    if (categoryId) {
      setLoading(true);
      const fetchCategory = async () => {
        try {
          const response = await getCategory(categoryId);
          if (response.ok) {
            setCategoryName(response.data.nome);
            setLoading(false);
          } else {
            console.log('Erro ao buscar categoria:', response.data);
          }
        } catch (error) {
          console.error('Erro ao realizar a requisição:', error);
        }
      };

      fetchCategory();
    }
  }, [categoryId]);

  const handleUpdateCategory = async () => {
    setLoading(true);
    setErrors({});
    try {
        const data = { nome: categoryName };
        const response = await putCategories(categoryId, data);
        if (response.ok) {
            navigation.navigate('Categorias', { successMessage: response.data.message });
        } else {
            setErrors(response.data.errors ? response.data.errors : { general: [response.data.message || 'Erro desconhecido'] });
        }
    } catch (error) {
        console.error('Erro ao realizar a requisição:', error);
        setErrors({ general: [error.message] });
    } finally {
        setLoading(false);
    }
  };

  const handleDeleteCategory = async () => {
    try {
      const response = await deleteCategory(categoryId);
      if (response.ok) {
        navigation.navigate('Categorias', { successMessage: 'Categoria excluída com sucesso!' });
      } else {
        Alert.alert('Erro', response.data.message || 'Erro ao excluir categoria.');
      }
    } catch (error) {
      console.error('Erro ao realizar a requisição:', error);
      Alert.alert('Erro', error.message);
    }
  };

  const showDeleteDialog = () => {
    setDialogVisible(true);
  };

  const handleConfirmDelete = () => {
    setDialogVisible(false);
    handleDeleteCategory();
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
      >
        <View style={styles.inputContainer}>
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
            onChangeText={(text) => setCategoryName(text)}
          />
        </View>

        <TouchableOpacity style={styles.saveButton} onPress={handleUpdateCategory}>
          <Ionicons name="save-outline" size={20} color="white" />
          <Text style={styles.saveButtonText}>Salvar</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.deleteButton} onPress={showDeleteDialog}>
          <Ionicons name="trash-outline" size={20} color="white" />
          <Text style={styles.deleteButtonText}>Excluir</Text>
        </TouchableOpacity>
      </ScrollView>

      <Dialog.Container visible={isDialogVisible}>
        <View style={styles.dialogContent}>
          <Ionicons name="warning-outline" size={30} color="#ff6f61" style={styles.dialogIcon} />
          <Dialog.Title style={styles.dialogTitle}>Atenção</Dialog.Title>
          <Dialog.Description style={styles.dialogDescription}>
            Você realmente deseja excluir esta categoria?
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
  inputContainer: {
    marginBottom: 30,
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
});

export default CategoryEdit;