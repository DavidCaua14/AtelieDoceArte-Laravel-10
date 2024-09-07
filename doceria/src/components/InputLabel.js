import React, { useState } from 'react';
import { View, TextInput, StyleSheet, Text } from 'react-native';
import Checkbox from 'expo-checkbox';
import { TextInputMask } from 'react-native-masked-text'; 

const InputLabel = ({
  type, 
  placeholder, 
  secureTextEntry, 
  onChangeText, 
  value, 
  maxLength, 
  onBlur, 
  autoFocus, 
  keyboardType, 
  selectedOptions, 
  onOptionChange 
}) => {
  let input;

  const handleMoneyChange = (text) => {
    const cleanText = text.replace(/[^0-9]/g, '');
    const formattedValue = (Number(cleanText) / 100).toFixed(2).replace('.', ',');
    onChangeText(formattedValue);
  };

  if (type === 'text') {
    input = (
      <TextInput
        placeholder={placeholder}
        style={styles.userInput}
        placeholderTextColor="#000000"
        onChangeText={onChangeText}
        value={value}
        secureTextEntry={secureTextEntry}
        maxLength={maxLength}
        onBlur={onBlur}
        autoFocus={autoFocus}
        keyboardType={keyboardType}
      />
    );
  } else if (type === 'checkbox') {
    input = (
      <View style={styles.checkboxContainer}>
        <Text style={styles.labelText}>Selecione as Categorias</Text>
        {selectedOptions.map(option => (
          <View key={option.id} style={styles.checkboxSection}>
            <Checkbox
              style={styles.checkbox}
              value={option.checked}
              onValueChange={() => onOptionChange(option.id)}
            />
            <Text style={styles.checkboxLabel}>{option.label}</Text>
          </View>
        ))}
      </View>
    );
  } else if (type === 'money') {
    input = (
      <TextInput
        placeholder={placeholder}
        style={styles.userInput}
        placeholderTextColor="#000000"
        onChangeText={handleMoneyChange}
        value={`R$ ${value}`}
        maxLength={maxLength}
        onBlur={onBlur}
        autoFocus={autoFocus}
        keyboardType="numeric"
      />
    );
  }

  return <View style={styles.inputContainer}>{input}</View>;
};

const styles = StyleSheet.create({
  inputContainer: {
    alignItems: 'center',
    marginTop: 10,
  },
  userInput: {
    width: 275,
    height: 41.3,
    borderColor: 'black',
    borderWidth: 1,
    borderRadius: 6,
    paddingLeft: 20,
    marginTop: 20,
    fontSize: 16,
  },
  checkboxContainer: {
    marginTop: 20,
    alignItems: 'flex-start',
  },
  checkboxSection: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  checkbox: {
    marginRight: 8,
  },
  checkboxLabel: {
    fontSize: 16,
  },
  labelText: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
  },
});

export default InputLabel;