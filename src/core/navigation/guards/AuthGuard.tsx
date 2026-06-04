import React, { useEffect } from 'react';
import { useNavigation } from '@react-navigation/native';
import { useAppSelector } from '../../store/store';
import type { RootStackNavigationProp } from '../types';

interface AuthGuardProps {
  children: React.ReactNode;
}

/**
 * HOC that protects authenticated routes.
 *
 * Watches `auth.status` and navigates to the Login screen whenever the
 * user is unauthenticated. Returns null (blank screen) while redirecting
 * so authenticated content is never briefly visible.
 *
 * Mirror of `AuthGuard` from the Flutter kit's route guard system.
 */
export const AuthGuard: React.FC<AuthGuardProps> = ({ children }) => {
  const { status } = useAppSelector((state) => state.auth);
  const navigation = useNavigation<RootStackNavigationProp>();

  useEffect(() => {
    if (status === 'unauthenticated') {
      navigation.navigate('Login');
    }
  }, [status, navigation]);

  if (status === 'unauthenticated') return null;

  return <>{children}</>;
};
