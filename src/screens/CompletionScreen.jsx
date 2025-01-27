import React, {useContext, useEffect, useState} from 'react';
import { View, Text, FlatList, Button, StyleSheet, Alert } from 'react-native';
import {fetchQuestions, fetchResponses} from '../api/ApiClient';
import AppContext from '../context/AppContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import STORAGE_KEYS from '../constants/StorageKeys';
import ACTION_TYPES from '../constants/ActionTypes';
import SCREEN_NAMES from '../constants/ScreenNames';

const CompletionScreen = ({ navigation }) => {
  const [responses, setResponses] = useState([]);
  const { state, dispatch } = useContext(AppContext);
  const {questions} = state;

  useEffect(() => {
    const fetchCompletedResponses = async () => {
      try {
        const username = await AsyncStorage.getItem(STORAGE_KEYS.USERNAME);
        const fetchedResponses = await fetchResponses(username);
        dispatch({ type: ACTION_TYPES.SET_RESPONSE, payload: fetchedResponses});
        if(questions.length <= 0){
          const newQuestions = await fetchQuestions();
          dispatch({ type: ACTION_TYPES.SET_QUESTIONS, payload: newQuestions });
        }
        setResponses(fetchedResponses);
      } catch (error) {
        Alert.alert('Error', 'Failed to fetch responses.');
      }
    };

    fetchCompletedResponses();
  }, []);

  const handleRestartSurvey = async () => {
    try {
      await AsyncStorage.removeItem(STORAGE_KEYS.PROGRESS);
      await AsyncStorage.removeItem(STORAGE_KEYS.RESPONSES);

      // Reset navigation stack to WelcomeScreen
      navigation.reset({
        index: 0,
        routes: [{ name: SCREEN_NAMES.WELCOME }],
      });
    } catch (error) {
      Alert.alert('Error', 'Failed to restart the survey. Please try again.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Survey Completion</Text>
      {responses.length > 0 ? (
        <FlatList
          data={responses}
          keyExtractor={(item) => item.id}
          renderItem={({ item, index }) => {
            const currentQuestion = questions[index];
            return (
              <View style={styles.responseBox}>
                <Text style={styles.questionText}>
                  Q{item.question_index + 1}: {currentQuestion?.Question}
                </Text>
                <Text style={styles.answerText}>Your Response: {item.response}</Text>
              </View>
            );
          }}
        />
      ) : (
        <Text>Loading responses...</Text>
      )}
      <Button title="Restart Survey" onPress={handleRestartSurvey} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  responseBox: {
    padding: 15,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    backgroundColor: '#f9f9f9',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  questionText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  answerText: {
    fontSize: 16,
    color: '#555',
  },
});

export default CompletionScreen;
