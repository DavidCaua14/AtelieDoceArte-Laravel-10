import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image, ScrollView, ImageBackground } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import InputLabel from '../components/InputLabel';
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../contexts/AuthContext';
import { loginUser } from '../hooks/Auth';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Loading from '../components/Loading';

const Login = () => {
    const [email, setEmail] = useState('admin@gmail.com');
    const [password, setPassword] = useState('12345678');
    const [isChecked, setIsChecked] = useState(false);
    const { storeToken } = useAuth();
    const navigation = useNavigation();
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});

    useEffect(() => {
        const checkToken = async () => {
            setLoading(true);
            try {
                const token = await AsyncStorage.getItem('@token');
                const stayLoggedIn = await AsyncStorage.getItem('@stayLoggedIn');
                if (token && stayLoggedIn === 'true') {
                    navigation.navigate('BottomTabs');
                }
            } catch (error) {
                console.error('Erro ao verificar token:', error);
            } finally {
                setLoading(false);
            }
        };

        checkToken();
    }, [navigation]);

    const handleCheckboxPress = () => {
        setIsChecked(!isChecked);
    };

    const navigateToCreateUser = () => {
        navigation.navigate('CreateUser');
    };

    const handleLogin = async () => {
        setLoading(true);

        try {
            const response = await loginUser({ email, password }, isChecked);

            if (response.ok) {
                const { token, user } = response.data;
                await AsyncStorage.setItem('@stayLoggedIn', isChecked ? 'true' : 'false');
                storeToken(token, user, isChecked);
                setLoading(false);
                navigation.navigate('BottomTabs');
            } else {
                if (response.data.errors) {
                    setErrors(response.data.errors);
                } else {
                    setErrors({ general: [response.data.message || 'Erro desconhecido'] });
                }
                setLoading(false);
            }
        } catch (error) {
            console.error('Error:', error);
            setErrors({ general: [error.message] });
            setLoading(false);
        }
    };

    if (loading) {
        return <Loading />;
    }

    return (
        <SafeAreaView style={styles.container}>
            <ImageBackground 
                source={{ uri: 'https://i.pinimg.com/originals/8b/02/f8/8b02f82d7e8deba6fab2a9552f135c21.jpg' }} 
                style={styles.backgroundImage} 
                resizeMode="cover"
            >
                <ScrollView
                    style={styles.scrollView}
                    contentContainerStyle={styles.scrollViewContent}
                    showsVerticalScrollIndicator={false}
                >
                    <View style={styles.innerContainer}>
                        <Image source={{ uri: 'https://i.pinimg.com/originals/bd/ef/e5/bdefe5d7b5f4884437588ab37a47bf0f.png' }} style={styles.logo} />
                        
                        <Text style={styles.title}>Login</Text>

                        {/* Alerta de Erro */}
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
                            placeholder="E-mail"
                            keyboardType="email-address"
                            secureTextEntry={false}
                            value={email}
                            onChangeText={setEmail}
                        />

                        <InputLabel
                            type="text"
                            placeholder="Senha"
                            secureTextEntry={true}
                            value={password}
                            onChangeText={setPassword}
                        />

                        <TouchableOpacity style={styles.checkboxContainer} onPress={handleCheckboxPress}>
                            <View style={styles.checkbox}>
                                {isChecked ? (
                                    <Ionicons name="checkbox-outline" size={24} color="black" />
                                ) : (
                                    <Ionicons name="square-outline" size={24} color="black" />
                                )}
                                <Text style={styles.checkboxText}>Manter conectado</Text>
                            </View>
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.button} onPress={handleLogin}>
                            <Text style={styles.buttonText}>ENTRAR</Text>
                        </TouchableOpacity>

                        <View style={styles.createAccountContainer}>
                            <Text style={styles.createAccountText}>
                                Não tem uma conta? 
                                <Text style={styles.createAccountLink} onPress={navigateToCreateUser}> Crie uma aqui</Text>
                            </Text>
                        </View>
                    </View>
                </ScrollView>
            </ImageBackground>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    backgroundImage: {
        flex: 1,
        justifyContent: 'center',
    },
    scrollView: {
        flex: 1,
    },
    scrollViewContent: {
        flexGrow: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    innerContainer: {
        alignItems: 'center',
        width: '80%',
        backgroundColor: 'rgba(255, 255, 255, 0.9)', 
        padding: 20,
        borderRadius: 10,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    logo: {
        width: 150,
        height: 150,
        marginBottom: 20,
        resizeMode: 'contain',
    },
    title: {
        fontSize: 32,
        fontWeight: 'bold',
        color: '#FF6347', 
        marginBottom: 20,
        textShadowColor: 'rgba(0, 0, 0, 0.25)',
        textShadowOffset: { width: 2, height: 2 },
        textShadowRadius: 5,
    },
    checkboxContainer: {
        flexDirection: 'row',
        marginTop: 20,
        marginLeft: -134,
    },
    checkbox: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    checkboxText: {
      marginLeft: 8,
    },
    button: {
        backgroundColor: '#FF6347',
        paddingVertical: 12,
        borderRadius: 5,
        marginTop: 20,
        width: 275,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    buttonText: {
        color: 'white',
        fontSize: 16,
        textAlign: 'center',
    },
    createAccountContainer: {
        marginTop: 20,
        width: '100%',
        alignItems: 'center',
    },
    createAccountText: {
        fontSize: 16,
        color: '#FF6347',
    },
    createAccountLink: {
        fontSize: 16,
        color: '#FF6347',
        fontWeight: 'bold',
    },
    alert: {
        backgroundColor: '#f8d7da',
        padding: 10,
        borderRadius: 5,
        marginTop: 10,
        width: '100%',
        alignItems: 'center',
    },
    alertText: {
        color: '#721c24',
    },
});

export default Login;