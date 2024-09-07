import React, { useEffect } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import Home from '../views/Home';
import CreateOption from '../views/CreateOption';
import Profile from '../views/Profile';
import { useAuth } from '../contexts/AuthContext';

const Tab = createBottomTabNavigator();

const BottomTabs = () => {
  const { user } = useAuth();

  useEffect(() => {
    console.log('User Info:', user); // Verificar se user está presente
    if (user) {
      console.log('User Level:', user.level); // Verifica se o nível do usuário está correto
    } else {
      console.log('User not loaded or missing level');
    }
  }, [user]);

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }) => {
          let iconName;

          if (route.name === 'Home') {
            iconName = 'home';
          } else if (route.name === 'Criar') {
            iconName = 'add-circle';
          } else if (route.name === 'Perfil') {
            iconName = 'person';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: 'tomato',
        tabBarInactiveTintColor: 'gray',
      })}
    >
      <Tab.Screen name="Home" component={Home} options={{ headerShown: false }} />

      {/* Mostra a aba Criar apenas se o nível do usuário for 10 */}
      {user?.level === 10 && (
        <Tab.Screen name="Criar" component={CreateOption} options={{ headerShown: false }} />
      )}

      <Tab.Screen name="Perfil" component={Profile} options={{ headerShown: false }} />
    </Tab.Navigator>
  );
};

export default BottomTabs;