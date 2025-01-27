import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import WelcomeScreen from '../screens/WelcomeScreen';
import QuestionScreen from '../screens/QuestionScreen';
import CompletionScreen from '../screens/CompletionScreen';
import SCREEN_NAMES from '../constants/ScreenNames';

const Stack = createStackNavigator();

const AppNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName={SCREEN_NAMES.WELCOME}>
        <Stack.Screen name={SCREEN_NAMES.WELCOME} component={WelcomeScreen} />
        <Stack.Screen name={SCREEN_NAMES.QUESTIONS} component={QuestionScreen} />
        <Stack.Screen name={SCREEN_NAMES.COMPLETION} component={CompletionScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
