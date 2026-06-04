import React, { useEffect, useState } from 'react';
import { View, TouchableOpacity, Text, Modal, StyleSheet, SafeAreaView } from 'react-native';
import NetworkLogger, { startNetworkLogging } from 'react-native-network-logger';
import { AppConstants } from '../../constants/appConstants';
import { Colors } from '../../theme/appTheme';

interface NetworkInspectorProviderProps {
  children: React.ReactNode;
}

/**
 * Wraps the app with network logging infrastructure.
 *
 * In development:
 *  - Calls `startNetworkLogging()` to install the XHR interceptor used by
 *    react-native-network-logger v1.
 *  - Renders a small floating button in the bottom-right corner.
 *  - Tapping the button opens a full-screen modal with the NetworkLogger UI.
 *
 * In production this provider is a transparent pass-through.
 */
export const NetworkInspectorProvider: React.FC<NetworkInspectorProviderProps> = ({
  children,
}) => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!AppConstants.enableNetworkInspector) return;

    // Start XHR interception (captures fetch + XMLHttpRequest automatically)
    startNetworkLogging({ maxRequests: 100 });
  }, []);

  if (!AppConstants.enableNetworkInspector) {
    return <>{children}</>;
  }

  return (
    <View style={styles.container}>
      {children}

      {/* Floating inspector button */}
      <TouchableOpacity
        style={styles.fab}
        onPress={() => setVisible(true)}
        activeOpacity={0.8}
      >
        <Text style={styles.fabText}>NET</Text>
      </TouchableOpacity>

      {/* Full-screen network log modal */}
      <Modal
        visible={visible}
        animationType="slide"
        onRequestClose={() => setVisible(false)}
      >
        <SafeAreaView style={styles.modalContainer}>
          {/* Close bar */}
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Network Inspector</Text>
            <TouchableOpacity onPress={() => setVisible(false)} style={styles.closeButton}>
              <Text style={styles.closeText}>Close</Text>
            </TouchableOpacity>
          </View>
          <NetworkLogger theme="light" />
        </SafeAreaView>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  fab: {
    position: 'absolute',
    bottom: 90,
    right: 16,
    backgroundColor: Colors.primaryDark,
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 6,
    opacity: 0.85,
    zIndex: 9999,
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  fabText: {
    color: Colors.white,
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.divider,
    backgroundColor: Colors.primary,
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.white,
  },
  closeButton: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 6,
  },
  closeText: {
    color: Colors.white,
    fontSize: 14,
    fontWeight: '600',
  },
});
