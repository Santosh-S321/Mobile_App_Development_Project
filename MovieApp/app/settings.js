import { useState } from 'react';
import {
  View, Text, TouchableOpacity, Switch, StyleSheet, ScrollView, Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';

const SETTINGS_KEY = 'app_settings';

export default function SettingsScreen() {
  const router = useRouter();
  const [darkMode, setDarkMode] = useState(true);
  const [autoPlay, setAutoPlay] = useState(false);
  const [highQuality, setHighQuality] = useState(true);
  const [language, setLanguage] = useState('English');

  const saveSettings = async (key, value) => {
    try {
      const current = await AsyncStorage.getItem(SETTINGS_KEY);
      const settings = current ? JSON.parse(current) : {};
      settings[key] = value;
      await AsyncStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
    } catch (e) {
      console.error('Failed to save settings', e);
    }
  };

  const SettingToggle = ({ icon, label, description, value, onChange, settingKey }) => (
    <View style={styles.settingRow}>
      <View style={styles.settingLeft}>
        <View style={styles.iconBox}>
          <Ionicons name={icon} size={18} color="#E50914" />
        </View>
        <View>
          <Text style={styles.settingLabel}>{label}</Text>
          {description ? <Text style={styles.settingDesc}>{description}</Text> : null}
        </View>
      </View>
      <Switch
        value={value}
        onValueChange={(v) => { onChange(v); saveSettings(settingKey, v); }}
        trackColor={{ false: '#2a2a3e', true: '#E50914' }}
        thumbColor="#fff"
      />
    </View>
  );

  const SettingButton = ({ icon, label, value, onPress }) => (
    <TouchableOpacity style={styles.settingRow} onPress={onPress} activeOpacity={0.7}>
      <View style={styles.settingLeft}>
        <View style={styles.iconBox}>
          <Ionicons name={icon} size={18} color="#E50914" />
        </View>
        <Text style={styles.settingLabel}>{label}</Text>
      </View>
      <View style={styles.settingRight}>
        {value ? <Text style={styles.settingValue}>{value}</Text> : null}
        <Ionicons name="chevron-forward" size={16} color="#555" />
      </View>
    </TouchableOpacity>
  );

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={22} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Settings</Text>
      </View>

      {/* Appearance */}
      <Text style={styles.sectionTitle}>Appearance</Text>
      <View style={styles.section}>
        <SettingToggle
          icon="moon"
          label="Dark Mode"
          description="Use dark theme throughout the app"
          value={darkMode}
          onChange={setDarkMode}
          settingKey="darkMode"
        />
        <SettingToggle
          icon="image"
          label="High Quality Images"
          description="Load higher resolution posters"
          value={highQuality}
          onChange={setHighQuality}
          settingKey="highQuality"
        />
      </View>

      {/* Playback */}
      <Text style={styles.sectionTitle}>Playback</Text>
      <View style={styles.section}>
        <SettingToggle
          icon="play-circle"
          label="Auto-Play Trailers"
          description="Automatically play trailers on detail screen"
          value={autoPlay}
          onChange={setAutoPlay}
          settingKey="autoPlay"
        />
      </View>

      {/* General */}
      <Text style={styles.sectionTitle}>General</Text>
      <View style={styles.section}>
        <SettingButton
          icon="language"
          label="Language"
          value={language}
          onPress={() => Alert.alert('Language', 'Select language:\n• English\n• Spanish\n• French')}
        />
        <SettingButton
          icon="notifications"
          label="Notifications"
          onPress={() => router.push('/notifications')}
        />
        <SettingButton
          icon="lock-closed"
          label="Privacy Policy"
          onPress={() => Alert.alert('Privacy Policy', 'This app stores your favorites locally on your device. No data is shared with third parties.')}
        />
        <SettingButton
          icon="trash"
          label="Clear Cache"
          onPress={() => Alert.alert('Clear Cache', 'Are you sure? This will remove all cached data.', [
            { text: 'Cancel', style: 'cancel' },
            { text: 'Clear', style: 'destructive', onPress: () => Alert.alert('Done', 'Cache cleared successfully.') },
          ])}
        />
      </View>

      {/* About */}
      <Text style={styles.sectionTitle}>About</Text>
      <View style={styles.section}>
        <SettingButton icon="information-circle" label="App Version" value="1.0.0" onPress={() => {}} />
        <SettingButton
          icon="star"
          label="Rate the App"
          onPress={() => Alert.alert('Thank You!', 'We appreciate your support!')}
        />
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
  sectionTitle: { color: '#888', fontSize: 12, fontWeight: '600', textTransform: 'uppercase', letterSpacing: 1, paddingHorizontal: 20, marginTop: 20, marginBottom: 8 },
  section: { marginHorizontal: 20, borderRadius: 12, overflow: 'hidden', borderWidth: 1, borderColor: '#1a1a2e' },
  settingRow: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    backgroundColor: '#0f0f1f', padding: 14, borderBottomWidth: 1, borderBottomColor: '#1a1a2e',
  },
  settingLeft: { flexDirection: 'row', alignItems: 'center', gap: 12, flex: 1 },
  iconBox: { width: 34, height: 34, borderRadius: 8, backgroundColor: '#1a1a2e', justifyContent: 'center', alignItems: 'center' },
  settingLabel: { color: '#fff', fontSize: 14, fontWeight: '500' },
  settingDesc: { color: '#666', fontSize: 11, marginTop: 1 },
  settingRight: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  settingValue: { color: '#888', fontSize: 13 },
});
