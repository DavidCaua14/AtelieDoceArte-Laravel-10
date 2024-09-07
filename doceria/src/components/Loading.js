import React from 'react';
import { View, ActivityIndicator, StyleSheet, SafeAreaView, Text } from 'react-native';

const Loading = () => {
    return (
        <SafeAreaView style={styles.safeAreaLoading}>
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#FF7F50" />
                <Text style={styles.loadingText}>Preparando seus doces...</Text>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeAreaLoading: {
        flex: 1,
        backgroundColor: '#FFF5E1',
        justifyContent: 'center',
        alignItems: 'center',
    },
    loadingContainer: {
        backgroundColor: '#FFFFFF',
        padding: 20,
        borderRadius: 10,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 2,
        elevation: 5,
    },
    loadingText: {
        marginTop: 15,
        fontSize: 16,
        color: '#333333',
        fontStyle: 'italic',
        textAlign: 'center',
    },
});

export default Loading;