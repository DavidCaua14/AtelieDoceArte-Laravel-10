import { WS_URL, DEBUG } from '../../Config';
import AsyncStorage from '@react-native-async-storage/async-storage';

async function tokenConfig(headers, token = null) {
    if (!token) {
        token = await AsyncStorage.getItem('@token');
        console.log('Token recuperado do AsyncStorage:', token);
    }
    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
        if (DEBUG) {
            console.log('Token enviado:', token);
        }
    }
    return headers;
}

export async function makeRequest(method, endpoint, data = null, token = null) {
    const url = `${WS_URL}/${endpoint}`;
    let headers = {};

    headers = await tokenConfig(headers, token);

    let body;
    if (data instanceof FormData) {
        body = data;
        headers = {
            ...headers,
            'Accept': 'application/json',
        };
    } else if (data) {
        headers = {
            ...headers,
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        };
        body = JSON.stringify(data);
    }

    const options = {
        method,
        headers,
        body: method !== 'GET' ? body : undefined,
    };

    if (DEBUG) {
        console.log('====Request=====');
        console.log(`${method} ${url}`);
        console.log('====Headers=====');
        console.log(headers);
        console.log('====Body=====');
        console.log(body);
    }

    const response = await fetch(url, options);

    let responseData;
    try {
        responseData = await response.json();
    } catch (error) {
        throw new Error(`Erro ${response.status}: ${response.statusText}`);
    }

    if (!response.ok) {
        return { ok: false, data: responseData };
    }

    return { ok: true, data: responseData };
}


