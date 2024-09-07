import React, { useContext } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { AuthProvider } from './src/contexts/AuthContext';
import Login from './src/views/Login';
import CreateUser from './src/views/CreateUser';
import BottomTabs from './src/navigations/BottomTabs';
import CategoryList from './src/views/CategoryList';
import CategoryCreate from './src/views/CategoryCreate';
import CategoryEdit from './src/views/CategoryEdit';
import ProductList from './src/views/ProductList';
import ProductCreate from './src/views/ProductCreate';
import ProductEdit from './src/views/ProductEdit';
import { Ionicons } from '@expo/vector-icons';
import ProductDetail from './src/views/ProductDetail';

const Stack = createStackNavigator();

export default function App() {


  return (
    <AuthProvider>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Login" screenOptions={{
        headerStyle: {
          backgroundColor: '#ffebcd'
        },
        headerTintColor: '#ff6f61', 
        headerTitleStyle: {
          fontWeight: 'bold',
        },
        headerBackTitleVisible: false,
        headerBackImage: () => (
          <Ionicons name="arrow-back-outline" size={24} color="#ff6f61" />
        ),
      }} >
            <Stack.Screen name="Login" component={Login} options={{ headerShown: false }} />
            <Stack.Screen name="CreateUser" component={CreateUser} options={{ headerShown: false }} />
            <Stack.Screen name="BottomTabs" component={BottomTabs} options={{ headerShown: false }} />
            <Stack.Screen name="Categorias" component={CategoryList} />
            <Stack.Screen name="Cadastrar Categoria" component={CategoryCreate} />
            <Stack.Screen name="Editar Categoria" component={CategoryEdit} />
            <Stack.Screen name="Produtos" component={ProductList} />
            <Stack.Screen name="Cadastrar Produto" component={ProductCreate} />
            <Stack.Screen name="Editar Produto" component={ProductEdit} />
            <Stack.Screen name="Detalhes" component={ProductDetail} />
        </Stack.Navigator>
      </NavigationContainer>
    </AuthProvider>
  );
}