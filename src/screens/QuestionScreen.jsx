import React, { useEffect, useContext, useState } from 'react';
import { View, Text, Button, FlatList, TouchableOpacity, StyleSheet, Alert, Animated, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import AppContext from '../context/AppContext';
import { fetchUserProgress, fetchQuestions, saveResponse } from '../api/ApiClient';
import ACTION_TYPES from '../constants/ActionTypes';
import STORAGE_KEYS from '../constants/StorageKeys';
import SCREEN_NAMES from '../constants/ScreenNames';

const QuestionScreen = ({ navigation, route }) => {
  const { state, dispatch } = useContext(AppContext);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [fadeAnim] = useState(new Animated.Value(1));
  const [loading, setLoading] = useState(true);
  const [retryCount, setRetryCount] = useState(0);
  const { username } = route.params;

  useEffect(() => {
    const initializeSurvey = async () => {
      try {
        const localUsername = await AsyncStorage.getItem(STORAGE_KEYS.USERNAME);
        if (username === localUsername) {
          const localProgress = await AsyncStorage.getItem(STORAGE_KEYS.PROGRESS);
          const localQuestions = await AsyncStorage.getItem(STORAGE_KEYS.QUESTIONS);
          const localResponses = await AsyncStorage.getItem(STORAGE_KEYS.RESPONSES);
          if (localProgress && localQuestions && localResponses) {
            dispatch({ type: ACTION_TYPES.SET_QUESTIONS, payload: JSON.parse(localQuestions) });
            dispatch({ type: ACTION_TYPES.SET_RESPONSE, payload: JSON.parse(localResponses) });
            setCurrentQuestionIndex(parseInt(localProgress, 10));
            setLoading(false);
            return;
          }
        }

        // Fetch new data from server
        const userProgress = await fetchUserProgress(username);
        const questions = await fetchQuestions();

        if (!questions || questions.length === 0) {
          Alert.alert('Error', 'No survey data available.');
          navigation.navigate(SCREEN_NAMES.WELCOME);
          return;
        }

        // Update AsyncStorage and Context
        await AsyncStorage.setItem(STORAGE_KEYS.USERNAME, username);
        await AsyncStorage.setItem(STORAGE_KEYS.PROGRESS, userProgress.completed_questions.toString());
        await AsyncStorage.setItem(STORAGE_KEYS.QUESTIONS, JSON.stringify(questions));
        dispatch({ type: ACTION_TYPES.SET_QUESTIONS, payload: questions });
        setCurrentQuestionIndex(userProgress.completed_questions);
      } catch (error) {
        if (retryCount < 3) {
          setRetryCount((prev) => prev + 1);
          initializeSurvey();
        } else {
          Alert.alert('Error', 'Failed to load survey data. Please check your connection.');
          navigation.navigate(SCREEN_NAMES.WELCOME);
        }
      } finally {
        setLoading(false);
      }
    };

    initializeSurvey();
  }, [dispatch, navigation, retryCount, username]);

  const fadeOut = () => new Promise((resolve) => Animated.timing(fadeAnim, { toValue: 0, duration: 300, useNativeDriver: true }).start(() => resolve()));

  const fadeIn = () => Animated.timing(fadeAnim, { toValue: 1, duration: 300, useNativeDriver: true }).start();

  const handleNext = async () => {
    if (!selectedAnswer) {
      Alert.alert('Error', 'Please select an answer.');
      return;
    }

    try {
      const updatedResponses = { ...state.responses, [currentQuestionIndex]: selectedAnswer };
      await saveResponse(username, currentQuestionIndex, selectedAnswer);

      // Update AsyncStorage and Context
      await AsyncStorage.setItem(STORAGE_KEYS.RESPONSES, JSON.stringify(updatedResponses));
      dispatch({
        type: ACTION_TYPES.SET_RESPONSE,
        payload: {
          index: currentQuestionIndex,
          response: selectedAnswer,
        },
      });

      if (currentQuestionIndex < state.questions.length - 1) {
        await fadeOut();
        setCurrentQuestionIndex((prev) => prev + 1);
        setSelectedAnswer(null);
        fadeIn();
      } else {
        navigation.navigate(SCREEN_NAMES.COMPLETION);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to save your response. Please try again.');
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text>Loading survey...</Text>
      </View>
    );
  }

  if (!state.questions || state.questions.length === 0) {
    return (
      <View style={styles.container}>
        <Text>No questions available.</Text>
        <Button title="Go Back" onPress={() => navigation.navigate(SCREEN_NAMES.WELCOME)} />
      </View>
    );
  }

  const currentQuestion = state.questions[currentQuestionIndex];

  return (
    <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
      <Text style={styles.progressText}>
        Question {currentQuestionIndex + 1}/{state.questions.length}
      </Text>
      <Text style={styles.questionText}>{currentQuestion?.Question}</Text>
      <FlatList
        data={currentQuestion?.Responses}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={selectedAnswer === item ? styles.selectedOption : styles.option}
            onPress={() => setSelectedAnswer(item)}
          >
            <Text>{item}</Text>
          </TouchableOpacity>
        )}
      />
      <View style={styles.navigationButtons}>
        <Button title="Next" onPress={handleNext} disabled={!selectedAnswer} />
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  progressText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  questionText: {
    fontSize: 22,
    marginBottom: 20,
  },
  option: {
    padding: 15,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
    marginBottom: 10,
  },
  selectedOption: {
    padding: 15,
    borderWidth: 1,
    borderColor: '#000',
    backgroundColor: '#ddd',
    borderRadius: 5,
    marginBottom: 10,
  },
  navigationButtons: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 20,
  },
});

export default QuestionScreen;
