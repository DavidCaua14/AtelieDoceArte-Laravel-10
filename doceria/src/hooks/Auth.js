import { makeRequest } from '../components/Ws';
import AsyncStorage from '@react-native-async-storage/async-storage';

export async function registerUser(formData) {
    const response = await makeRequest('POST', 'api/register', formData);
    if (response.ok) {
        await AsyncStorage.setItem('@token', response.data.token);
        console.log('Token salvo com sucesso:', response.data.token);
    }
    return response;
}

export async function loginUser(formData, rememberMe = false) {
    const response = await makeRequest('POST', 'api/login', formData);
    if (response.ok) {
        if (rememberMe) {
            await AsyncStorage.setItem('@token', response.data.token);
            await AsyncStorage.setItem('@stayLoggedIn', 'true');
        } else {
            await AsyncStorage.setItem('@token', response.data.token);
            await AsyncStorage.removeItem('@stayLoggedIn');
        }
        console.log('Token salvo com sucesso:', response.data.token);
    }
    return response;
}

export async function logout() {
    try {
        console.log('Iniciando logout...');
        const response = await makeRequest('POST', 'api/logout');
        console.log('Resposta do servidor:', response);
        if (response.ok) {
            await AsyncStorage.removeItem('@token');
            console.log('Token removido com sucesso');
        } else {
            console.log('Erro na resposta da API');
            throw new Error('Erro ao fazer logout');
        }
    } catch (error) {
        console.error('Erro durante o logout:', error);
        throw error;
    }
}
