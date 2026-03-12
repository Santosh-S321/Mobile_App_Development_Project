import { useState, useEffect } from 'react';
import {
  View, Text, TouchableOpacity, Switch, StyleSheet, ScrollView, Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { registerForPushNotifications, sendTestNotification, scheduleWeeklyNotification } from './utils/notifications';

export default function NotificationsScreen() {
  const router = useRouter();
  const [permissionStatus, setPermissionStatus] = useState(null);
  const [weeklyEnabled, setWeeklyEnabled] = useState(false);
  const [newReleasesEnabled, setNewReleasesEnabled] = useState(true);
  const [trendingEnabled, setTrendingEnabled] = useState(true);

  useEffect(() => {
    checkPermissions();
  }, []);

  const checkPermissions = async () => {
    const status = await registerForPushNotifications();
    setPermissionStatus(status);
  };

  const handleEnableNotifications = async () => {
    const status = await registerForPushNotifications();
    setPermissionStatus(status);
    if (status === 'granted') {
      Alert.alert('✅ Notifications Enabled', 'You will now receive CineTrack notifications!');
    } else {
      Alert.alert('Permission Denied', 'Please enable notifications in your device settings.');
    }
  };

  const handleTestNotification = async () => {
    if (permissionStatus !== 'granted') {
      Alert.alert('Permission Required', 'Please enable notifications first.');
      return;
    }
    await sendTestNotification();
    Alert.alert('Test Sent! 🎬', 'You should receive a notification in 2 seconds.');
  };

  const handleWeeklyToggle = async (value) => {
    setWeeklyEnabled(value);
    if (value) {
      await scheduleWeeklyNotification();
      Alert.alert('Weekly Digest', 'You\'ll get movie picks every Monday at 9 AM!');
    }
  };

  const NotifToggle = ({ icon, title, subtitle, value, onChange }) => (
    <View style={styles.notifRow}>
      <View style={styles.notifLeft}>
        <View style={styles.iconBox}>
          <Ionicons name={icon} size={18} color="#E50914" />
        </View>
        <View style={{ flex: 1 }}>
          <Text style={styles.notifTitle}>{title}</Text>
          <Text style={styles.notifSub}>{subtitle}</Text>
        </View>
      </View>
      <Switch
        value={value}
        onValueChange={onChange}
        trackColor={{ false: '#2a2a3e', true: '#E50914' }}
        thumbColor="#fff"
        disabled={permissionStatus !== 'granted'}
      />
    </View>
  );

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={22} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Notifications</Text>
      </View>

      {/* Permission status */}
      <View style={styles.statusCard}>
        <View style={styles.statusLeft}>
          <Ionicons
            name={permissionStatus === 'granted' ? 'checkmark-circle' : 'alert-circle'}
            size={28}
            color={permissionStatus === 'granted' ? '#4caf50' : '#E50914'}
          />
          <View>
            <Text style={styles.statusTitle}>
              {permissionStatus === 'granted' ? 'Notifications Enabled' : 'Notifications Disabled'}
            </Text>
            <Text style={styles.statusSub}>
              {permissionStatus === 'granted'
                ? 'You will receive CineTrack alerts'
                : 'Tap below to enable notifications'}
            </Text>
          </View>
        </View>
        {permissionStatus !== 'granted' && (
          <TouchableOpacity style={styles.enableBtn} onPress={handleEnableNotifications}>
            <Text style={styles.enableBtnText}>Enable</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Notification types */}
      <Text style={styles.sectionTitle}>Notification Types</Text>
      <View style={styles.section}>
        <NotifToggle
          icon="trending-up"
          title="Weekly Trending"
          subtitle="Monday morning movie picks"
          value={weeklyEnabled}
          onChange={handleWeeklyToggle}
        />
        <NotifToggle
          icon="film"
          title="New Releases"
          subtitle="Alerts for new movies added"
          value={newReleasesEnabled}
          onChange={setNewReleasesEnabled}
        />
        <NotifToggle
          icon="flame"
          title="Trending Alerts"
          subtitle="When a movie becomes trending"
          value={trendingEnabled}
          onChange={setTrendingEnabled}
        />
      </View>

      {/* Test Notification */}
      <Text style={styles.sectionTitle}>Test</Text>
      <View style={styles.section}>
        <TouchableOpacity style={styles.testBtn} onPress={handleTestNotification}>
          <View style={styles.notifLeft}>
            <View style={styles.iconBox}>
              <Ionicons name="send" size={18} color="#E50914" />
            </View>
            <View>
              <Text style={styles.notifTitle}>Send Test Notification</Text>
              <Text style={styles.notifSub}>Triggers a sample alert in 2 seconds</Text>
            </View>
          </View>
          <Ionicons name="chevron-forward" size={16} color="#555" />
        </TouchableOpacity>
      </View>

      <View style={{ height: 40 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0a0a1a' },
  header: {
    flexDirection: 'row', alignItems: 'center', gap: 14,
    paddingHorizontal: 16, paddingTop: 56, paddingBottom: 16,
    backgroundColor: '#0f0f1f', borderBottomWidth: 1, borderBottomColor: '#1a1a2e',
  },
  backBtn: { padding: 4 },
  headerTitle: { color: '#fff', fontSize: 22, fontWeight: '800' },
  statusCard: {
    margin: 20, backgroundColor: '#0f0f1f', borderRadius: 12, padding: 16,
    borderWidth: 1, borderColor: '#1a1a2e', flexDirection: 'row',
    justifyContent: 'space-between', alignItems: 'center',
  },
  statusLeft: { flexDirection: 'row', alignItems: 'center', gap: 12, flex: 1 },
  statusTitle: { color: '#fff', fontWeight: '700', fontSize: 14 },
  statusSub: { color: '#888', fontSize: 12, marginTop: 2 },
  enableBtn: { backgroundColor: '#E50914', paddingHorizontal: 14, paddingVertical: 8, borderRadius: 8 },
  enableBtnText: { color: '#fff', fontWeight: '700', fontSize: 13 },
  sectionTitle: { color: '#888', fontSize: 12, fontWeight: '600', textTransform: 'uppercase', letterSpacing: 1, paddingHorizontal: 20, marginBottom: 8 },
  section: { marginHorizontal: 20, borderRadius: 12, overflow: 'hidden', borderWidth: 1, borderColor: '#1a1a2e', marginBottom: 20 },
  notifRow: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    backgroundColor: '#0f0f1f', padding: 14, borderBottomWidth: 1, borderBottomColor: '#1a1a2e',
  },
  notifLeft: { flexDirection: 'row', alignItems: 'center', gap: 12, flex: 1 },
  iconBox: { width: 34, height: 34, borderRadius: 8, backgroundColor: '#1a1a2e', justifyContent: 'center', alignItems: 'center' },
  notifTitle: { color: '#fff', fontSize: 14, fontWeight: '500' },
  notifSub: { color: '#666', fontSize: 11, marginTop: 1 },
  testBtn: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    backgroundColor: '#0f0f1f', padding: 14,
  },
});
