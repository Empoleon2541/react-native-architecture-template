import React, { useEffect, useRef } from 'react';
import { NavigationContainer, NavigationContainerRef } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';

import { useAppDispatch, useAppSelector } from '../store/store';
import { checkAuthThunk } from '../../features/auth/presentation/store/authSlice';

import { LoginScreen } from '../../features/auth/presentation/screens/LoginScreen';
import { ProfileScreen } from '../../features/auth/presentation/screens/ProfileScreen';
import { PostsScreen } from '../../features/posts/presentation/screens/PostsScreen';
import { PostDetailScreen } from '../../features/posts/presentation/screens/PostDetailScreen';
import { RealtimeScreen } from '../../features/realtime/presentation/screens/RealtimeScreen';

import type { RootStackParamList, MainTabParamList, PostsStackParamList } from './types';
import { Colors } from '../theme/appTheme';

// ─── Navigators ───────────────────────────────────────────────────────────────

const RootStack = createNativeStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator<MainTabParamList>();
const PostsStack = createNativeStackNavigator<PostsStackParamList>();

// ─── Posts stack (nested inside the Posts tab) ────────────────────────────────

function PostsNavigator() {
  return (
    <PostsStack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: Colors.primary },
        headerTintColor: Colors.white,
        headerTitleStyle: { fontWeight: '600' },
      }}
    >
      <PostsStack.Screen
        name="PostsList"
        component={PostsScreen}
        options={{ title: 'Posts' }}
      />
      <PostsStack.Screen
        name="PostDetail"
        component={PostDetailScreen}
        options={{ title: 'Post Detail' }}
      />
    </PostsStack.Navigator>
  );
}

// ─── Main bottom tab navigator ────────────────────────────────────────────────

export function MainNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: Colors.tabActive,
        tabBarInactiveTintColor: Colors.tabInactive,
        tabBarStyle: {
          backgroundColor: Colors.white,
          borderTopColor: Colors.divider,
          elevation: 8,
          shadowOpacity: 0.1,
        },
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: React.ComponentProps<typeof Ionicons>['name'];

          if (route.name === 'PostsTab') {
            iconName = focused ? 'document-text' : 'document-text-outline';
          } else if (route.name === 'Realtime') {
            iconName = focused ? 'pulse' : 'pulse-outline';
          } else {
            iconName = focused ? 'person' : 'person-outline';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen
        name="PostsTab"
        component={PostsNavigator}
        options={{ tabBarLabel: 'Posts' }}
      />
      <Tab.Screen
        name="Realtime"
        component={RealtimeScreen}
        options={{
          tabBarLabel: 'Realtime',
          headerShown: true,
          headerTitle: 'Realtime Events',
          headerStyle: { backgroundColor: Colors.primary },
          headerTintColor: Colors.white,
          headerTitleStyle: { fontWeight: '600' },
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          tabBarLabel: 'Profile',
          headerShown: true,
          headerTitle: 'Profile',
          headerStyle: { backgroundColor: Colors.primary },
          headerTintColor: Colors.white,
          headerTitleStyle: { fontWeight: '600' },
        }}
      />
    </Tab.Navigator>
  );
}

// ─── Root app navigator ───────────────────────────────────────────────────────

/**
 * Top-level navigator.
 *
 * On mount it attempts to restore the session via `checkAuthThunk`.
 * A `useEffect` then watches `auth.status` and navigates to Login or Main
 * accordingly — mirroring the `_AuthChangeNotifier` pattern from GoRouter.
 */
export function AppNavigator() {
  const dispatch = useAppDispatch();
  const { status } = useAppSelector((state) => state.auth);
  const navigationRef = useRef<NavigationContainerRef<RootStackParamList>>(null);

  // Attempt to restore session on startup
  useEffect(() => {
    dispatch(checkAuthThunk());
  }, [dispatch]);

  // React to auth state changes and redirect accordingly
  useEffect(() => {
    if (!navigationRef.current?.isReady()) return;

    if (status === 'authenticated') {
      navigationRef.current.navigate('Main');
    } else if (status === 'unauthenticated' || status === 'error') {
      navigationRef.current.navigate('Login');
    }
    // 'initial' and 'loading' — do nothing; let the splash stay
  }, [status]);

  return (
    <NavigationContainer ref={navigationRef}>
      <RootStack.Navigator screenOptions={{ headerShown: false }}>
        {/* Login is always in the stack so deep-link redirects work */}
        <RootStack.Screen name="Login" component={LoginScreen} />
        <RootStack.Screen name="Main" component={MainNavigator} />
      </RootStack.Navigator>
    </NavigationContainer>
  );
}
