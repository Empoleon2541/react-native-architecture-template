import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import type { RootStackParamList } from './types';
import { LoginScreen } from '../../features/auth/presentation/screens/LoginScreen';
import { MainNavigator } from './AppNavigator';

const Stack = createNativeStackNavigator<RootStackParamList>();

/**
 * Root stack: Login (unauthenticated) ↔ Main (authenticated tabs).
 * Auth redirect logic lives in AppNavigator's useEffect.
 */
export const RootNavigator: React.FC = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Main" component={MainNavigator} />
    </Stack.Navigator>
  );
};
