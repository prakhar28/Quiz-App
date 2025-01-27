import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import SCREEN_NAMES from '../constants/ScreenNames';

const WelcomeScreen = ({ navigation }) => {
  const [username, setUsername] = useState('');

  const handleStartSurvey = async () => {
    if (username.trim() === '') {
      Alert.alert('Error', 'Please enter a valid username to start the survey.');
      return;
    }
    try {
      // Navigate to QuestionScreen with username
      navigation.navigate(SCREEN_NAMES.QUESTIONS, { username: username.trim() });
      setUsername('');
    } catch (error) {
      Alert.alert('Error', 'Failed to start the survey. Please try again.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome to the Health Survey</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter your username"
        value={username}
        onChangeText={setUsername}
      />
      <Button title="Start Survey" onPress={handleStartSurvey} disabled={username.trim() === ''} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    width: '100%',
    padding: 10,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
  },
});

export default WelcomeScreen;
