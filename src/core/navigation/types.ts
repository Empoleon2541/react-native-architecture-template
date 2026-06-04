import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import type { CompositeNavigationProp } from '@react-navigation/native';

// ─── Stack param lists ────────────────────────────────────────────────────────

export type RootStackParamList = {
  Login: undefined;
  Main: undefined;
};

export type MainTabParamList = {
  PostsTab: undefined;
  Realtime: undefined;
  Profile: undefined;
};

export type PostsStackParamList = {
  PostsList: undefined;
  PostDetail: { id: number };
};

// ─── Typed navigation props ───────────────────────────────────────────────────

export type RootStackNavigationProp = NativeStackNavigationProp<RootStackParamList>;

export type MainTabNavigationProp = CompositeNavigationProp<
  BottomTabNavigationProp<MainTabParamList>,
  NativeStackNavigationProp<RootStackParamList>
>;

export type PostsStackNavigationProp = CompositeNavigationProp<
  NativeStackNavigationProp<PostsStackParamList>,
  MainTabNavigationProp
>;
