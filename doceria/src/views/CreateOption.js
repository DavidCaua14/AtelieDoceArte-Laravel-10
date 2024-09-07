import React from "react";
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView, ScrollView } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { useNavigation } from '@react-navigation/native';

const CreateOption = () => {
  const navigation = useNavigation();

  const navigateToCategoryList = () => {
    navigation.navigate('Categorias');
  };

  const navigateToProductList = () => {
    navigation.navigate('Produtos');
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollViewContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.button} onPress={navigateToCategoryList}>
            <View style={styles.buttonContent}>
              <Icon name="tags" size={30} color="#ffffff" style={styles.buttonIcon} />
              <Text style={styles.buttonText}>Categorias</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={navigateToProductList} >
            <View style={styles.buttonContent}>
              <Icon name="shopping-cart" size={30} color="#ffffff" style={styles.buttonIcon} />
              <Text style={styles.buttonText}>Produtos</Text>
            </View>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollView: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollViewContent: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  buttonContainer: {
    width: '100%',
    alignItems: 'center',
  },
  button: {
    backgroundColor: '#ff6f61', 
    width: 250, 
    height: 60,
    borderRadius: 10,
    marginVertical: 10,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 3, 
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonIcon: {
    marginRight: 10,
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default CreateOption;