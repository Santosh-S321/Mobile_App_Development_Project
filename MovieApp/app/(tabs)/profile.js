import {
  View, Text, TouchableOpacity, StyleSheet, Alert, ScrollView,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../context/AuthContext';
import { useFavorites } from '../context/FavoritesContext';

export default function ProfileScreen() {
  const { user, logout } = useAuth();
  const { favorites } = useFavorites();
  const router = useRouter();

  const handleLogout = () => {
    Alert.alert('Sign Out', 'Are you sure you want to sign out?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Sign Out', style: 'destructive', onPress: async () => { await logout(); router.replace('/(auth)/login'); } },
    ]);
  };

  const menuItems = [
    { icon: 'heart', label: 'My Favorites', value: `${favorites.length} movies`, onPress: () => router.push('/(tabs)/favorites') },
    { icon: 'settings', label: 'Settings', onPress: () => router.push('/settings') },
    { icon: 'notifications', label: 'Notifications', onPress: () => router.push('/notifications') },
    { icon: 'information-circle', label: 'About', onPress: () => Alert.alert('CineTrack', 'Version 1.0.0\nYour personal movie journal.') },
  ];

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Profile</Text>
      </View>

      {/* Avatar */}
      <View style={styles.avatarSection}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{user?.username?.[0]?.toUpperCase() || '?'}</Text>
        </View>
        <Text style={styles.username}>{user?.username}</Text>
        <Text style={styles.email}>{user?.email}</Text>
        <Text style={styles.joined}>Member since {new Date(user?.createdAt || Date.now()).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</Text>
      </View>

      {/* Stats */}
      <View style={styles.statsRow}>
        <View style={styles.statBox}>
          <Text style={styles.statNum}>{favorites.length}</Text>
          <Text style={styles.statLabel}>Favorites</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statBox}>
          <Text style={styles.statNum}>🎬</Text>
          <Text style={styles.statLabel}>Movie Fan</Text>
        </View>
      </View>

      {/* Menu */}
      <View style={styles.menu}>
        {menuItems.map((item, i) => (
          <TouchableOpacity key={i} style={styles.menuItem} onPress={item.onPress} activeOpacity={0.7}>
            <View style={styles.menuLeft}>
              <View style={styles.iconBox}>
                <Ionicons name={item.icon} size={18} color="#E50914" />
              </View>
              <Text style={styles.menuLabel}>{item.label}</Text>
            </View>
            <View style={styles.menuRight}>
              {item.value ? <Text style={styles.menuValue}>{item.value}</Text> : null}
              <Ionicons name="chevron-forward" size={16} color="#555" />
            </View>
          </TouchableOpacity>
        ))}
      </View>

      <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
        <Ionicons name="log-out-outline" size={20} color="#E50914" />
        <Text style={styles.logoutText}>Sign Out</Text>
      </TouchableOpacity>

      <View style={{ height: 40 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0a0a1a' },
  header: {
    paddingHorizontal: 20, paddingTop: 56, paddingBottom: 16,
    backgroundColor: '#0f0f1f', borderBottomWidth: 1, borderBottomColor: '#1a1a2e',
  },
  headerTitle: { color: '#fff', fontSize: 24, fontWeight: '800' },
  avatarSection: { alignItems: 'center', paddingVertical: 28 },
  avatar: {
    width: 80, height: 80, borderRadius: 40,
    backgroundColor: '#E50914', justifyContent: 'center', alignItems: 'center', marginBottom: 12,
  },
  avatarText: { color: '#fff', fontSize: 32, fontWeight: '800' },
  username: { color: '#fff', fontSize: 20, fontWeight: '700' },
  email: { color: '#888', fontSize: 14, marginTop: 2 },
  joined: { color: '#555', fontSize: 12, marginTop: 4 },
  statsRow: {
    flexDirection: 'row', marginHorizontal: 20, backgroundColor: '#0f0f1f',
    borderRadius: 12, padding: 16, marginBottom: 20, borderWidth: 1, borderColor: '#1a1a2e',
  },
  statBox: { flex: 1, alignItems: 'center', gap: 4 },
  statNum: { color: '#fff', fontSize: 22, fontWeight: '800' },
  statLabel: { color: '#888', fontSize: 12 },
  statDivider: { width: 1, backgroundColor: '#1a1a2e' },
  menu: { marginHorizontal: 20, gap: 2 },
  menuItem: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    backgroundColor: '#0f0f1f', padding: 14, borderRadius: 10,
    borderWidth: 1, borderColor: '#1a1a2e',
  },
  menuLeft: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  iconBox: {
    width: 34, height: 34, borderRadius: 8,
    backgroundColor: '#1a1a2e', justifyContent: 'center', alignItems: 'center',
  },
  menuLabel: { color: '#fff', fontSize: 15 },
  menuRight: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  menuValue: { color: '#888', fontSize: 13 },
  logoutBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    gap: 8, marginHorizontal: 20, marginTop: 20, padding: 14,
    backgroundColor: '#1a0a0a', borderRadius: 10, borderWidth: 1, borderColor: '#E50914',
  },
  logoutText: { color: '#E50914', fontWeight: '700', fontSize: 15 },
});
