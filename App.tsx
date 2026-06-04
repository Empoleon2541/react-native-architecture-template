import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { Provider } from 'react-redux';
import { store } from './src/core/store/store';
import { AppNavigator } from './src/core/navigation/AppNavigator';
import { NetworkInspectorProvider } from './src/core/api/inspector/NetworkInspectorProvider';
import { setupDependencies } from './src/core/di/serviceLocator';
import { setupMockAdapter } from './src/core/api/mockAdapter';

// ─── Bootstrap (runs once before React renders) ───────────────────────────────

// 1. Install axios-mock-adapter so all API calls resolve in-process
setupMockAdapter();

// 2. Wire up all datasources, repositories, and use cases in the service locator
setupDependencies();

// ─── App root ─────────────────────────────────────────────────────────────────

export default function App() {
  return (
    <Provider store={store}>
      <NetworkInspectorProvider>
        <AppNavigator />
        <StatusBar style="light" />
      </NetworkInspectorProvider>
    </Provider>
  );
}
