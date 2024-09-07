import React, { createContext, useState, useContext, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(null);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const loadToken = async () => {
      try {
        const savedToken = await AsyncStorage.getItem('userToken');
        const savedUser = await AsyncStorage.getItem('userInfo');
        if (savedToken && savedUser) {
          setToken(savedToken);
          setUser(JSON.parse(savedUser)); // Certifique-se que o user tenha o campo level
        }
      } catch (error) {
        console.error('Erro ao carregar token do armazenamento:', error);
      }
    };

    loadToken();
  }, []);

  const storeToken = async (newToken, userData, rememberMe) => {
    // Verifica se userData contém o nível do usuário
    console.log('Storing Token:', newToken);
    console.log('Storing User Data:', userData); 
    setToken(newToken);
    setUser(userData);
    if (rememberMe) {
      await AsyncStorage.setItem('userToken', newToken);
      await AsyncStorage.setItem('userInfo', JSON.stringify(userData));
    }
  };

  const clearToken = async () => {
    setToken(null);
    setUser(null);
    await AsyncStorage.removeItem('userToken');
    await AsyncStorage.removeItem('userInfo');
  };

  return (
    <AuthContext.Provider value={{ token, user, storeToken, clearToken }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);