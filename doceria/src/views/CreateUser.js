import React, { useState } from "react";
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, ImageBackground } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import InputLabel from "../components/InputLabel";
import { useNavigation } from "@react-navigation/native";
import { SafeAreaView } from 'react-native-safe-area-context';
import { registerUser } from '../hooks/Auth';
import { useAuth } from "../contexts/AuthContext";
import Loading from '../components/Loading';

const CreateUser = () => {
    const navigation = useNavigation();
    const { storeToken, authToken } = useAuth(); 
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);

    const handleRegister = async () => {
        setLoading(true);
        try {
            const formData = {
                name,
                email,
                password,
                password_confirmation: confirmPassword,
            };
    
            const response = await registerUser(formData, authToken);
            if (response.ok) {
                const { token, user } = response.data;
                await storeToken(token, user, true); 
                setLoading(false);
                navigation.navigate('BottomTabs');
            } else {
                setErrors(response.data.errors || {});
                setLoading(false);
            }
        } catch (error) {
            setErrors({ general: [error.message] });
            setLoading(false);
        }
    };

    if (loading) {
        return <Loading/>;  
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

                    <TouchableOpacity
                        style={styles.backButton}
                        onPress={() => navigation.goBack()}
                    >
                        <Ionicons name="chevron-back-outline" size={30} color="black" />
                    </TouchableOpacity>

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



                        <Text style={styles.title}>Cadastrar-se</Text>

                        <InputLabel
                            type="text"
                            placeholder="Nome"
                            value={name}
                            onChangeText={setName}
                            secureTextEntry={false}
                        />
                        <InputLabel
                            type="text"
                            placeholder="E-mail"
                            value={email}
                            onChangeText={setEmail}
                            keyboardType="email-address"
                            secureTextEntry={false}
                        />
                        <InputLabel
                            type="text"
                            placeholder="Senha"
                            value={password}
                            onChangeText={setPassword}
                            secureTextEntry={true}
                        />
                        <InputLabel
                            type="text"
                            placeholder="Confirmar senha"
                            value={confirmPassword}
                            onChangeText={setConfirmPassword}
                            secureTextEntry={true}
                        />

                        <TouchableOpacity style={styles.button} onPress={handleRegister}>
                            <Text style={styles.buttonText}>CADASTRAR</Text>
                        </TouchableOpacity>
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
    backButton: {
        alignSelf: 'flex-start',
        
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
    title: {
        fontSize: 32,
        fontWeight: 'bold',
        color: '#FF6347', 
        marginBottom: 20,
        textShadowColor: 'rgba(0, 0, 0, 0.25)',
        textShadowOffset: { width: 2, height: 2 },
        textShadowRadius: 5,
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
    alert: {
        backgroundColor: '#f8d7da',
        padding: 10,
        borderRadius: 5,
        marginBottom: 20,
        width: '100%',
        alignItems: 'center',
    },
    alertText: {
        color: '#721c24',
    },
});

export default CreateUser;
