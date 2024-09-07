import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Image, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/FontAwesome';
import Dialog from 'react-native-dialog';
import { logout } from '../hooks/Auth';
import Loading from '../components/Loading';
import { useAuth } from '../contexts/AuthContext';

const Profile = ({ navigation }) => {
  const [isDialogVisible, setDialogVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  const handleLogout = async () => {
    setLoading(true);
    try {
      await logout();
      navigation.reset({
        index: 0,
        routes: [{ name: 'Login' }],
      });
    } catch (error) {
      Alert.alert('Erro', 'Houve um problema ao sair. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  const showLogoutDialog = () => {
    setDialogVisible(true);
  };

  const handleConfirmLogout = () => {
    setDialogVisible(false);
    handleLogout();
  };

  const handleCancelLogout = () => {
    setDialogVisible(false);
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollViewContent} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.greeting}>Olá, {user?.name || 'Cliente'}!</Text>
          <Text style={styles.subGreeting}>Obrigado por usar o Ateliê Doce e Arte!</Text>
          <View style={styles.profileInfo}>
            <Image
              source={{
                uri:
                  user?.profileImage ||
                  'https://i.pinimg.com/originals/f6/46/1c/f6461cc2e193f8d93ab933b89bb6d1da.jpg',
              }}
              style={styles.profileImage}
            />
            <Text style={styles.username}>{user?.name}</Text>
            <Text style={styles.email}>{user?.email}</Text>
          </View>
          <View style={styles.separator} />
        </View>

        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.logoutButton} onPress={showLogoutDialog}>
            <Icon name="sign-out" size={20} color="#ffffff" style={styles.buttonIcon} />
            <Text style={styles.buttonText}>Sair</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      <Dialog.Container visible={isDialogVisible}>
        <View style={styles.dialogContent}>
          <Icon name="warning" size={30} color="#ff6f61" style={styles.dialogIcon} />
          <Dialog.Title style={styles.dialogTitle}>Atenção</Dialog.Title>
          <Dialog.Description style={styles.dialogDescription}>
            Você realmente deseja sair?
          </Dialog.Description>
          <View style={styles.dialogButtons}>
            <Dialog.Button
              label="Cancelar"
              onPress={handleCancelLogout}
              style={styles.dialogButtonCancel}
            />
            <Dialog.Button
              label="Sim"
              onPress={handleConfirmLogout}
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
    backgroundColor: '#FFF8F3',
  },
  scrollViewContent: {
    flexGrow: 1,
    padding: 20,
    alignItems: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: 30,
  },
  greeting: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#B22222',
    textAlign: 'center',
  },
  subGreeting: {
    fontSize: 16,
    color: '#A52A2A',
    textAlign: 'center',
    marginVertical: 5,
  },
  profileInfo: {
    alignItems: 'center',
    marginVertical: 20,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 10,
  },
  username: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  email: {
    fontSize: 14,
    color: '#666',
    marginVertical: 5,
  },
  points: {
    fontSize: 16,
    color: '#FF6347',
    fontWeight: '600',
  },
  editProfileButton: {
    backgroundColor: '#FF69B4',
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 5,
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 3,
  },
  editProfileText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  separator: {
    width: '80%',
    height: 1,
    backgroundColor: '#e0e0e0',
    marginVertical: 20,
  },
  buttonContainer: {
    alignItems: 'center',
    width: '100%',
  },
  logoutButton: {
    backgroundColor: '#ff6f61',
    paddingVertical: 12,
    paddingHorizontal: 50,
    borderRadius: 5,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 3,
  },
  buttonIcon: {
    marginRight: 10,
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  dialogContent: {
    alignItems: 'center',
    padding: 20,
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

export default Profile;