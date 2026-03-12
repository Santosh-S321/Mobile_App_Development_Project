import {
  View, Text, FlatList, Image, TouchableOpacity,
  StyleSheet, Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useFavorites } from '../context/FavoritesContext';
import { IMAGE_BASE_URL } from '../utils/api';

export default function FavoritesScreen() {
  const { favorites, removeFavorite } = useFavorites();
  const router = useRouter();

  const handleRemove = (movie) => {
    Alert.alert('Remove Favorite', `Remove "${movie.title}" from favorites?`, [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Remove', style: 'destructive', onPress: () => removeFavorite(movie.id) },
    ]);
  };

  const renderMovie = ({ item }) => (
    <TouchableOpacity style={styles.item} onPress={() => router.push(`/movie/${item.id}`)} activeOpacity={0.8}>
      <Image
        source={{ uri: `${IMAGE_BASE_URL}${item.poster_path}` }}
        style={styles.poster}
      />
      <View style={styles.info}>
        <Text style={styles.title} numberOfLines={2}>{item.title}</Text>
        <View style={styles.ratingRow}>
          <Ionicons name="star" size={13} color="#f5c518" />
          <Text style={styles.rating}>{item.vote_average?.toFixed(1)}</Text>
        </View>
        <Text style={styles.savedLabel}>❤️ Saved to favorites</Text>
      </View>
      <TouchableOpacity style={styles.removeBtn} onPress={() => handleRemove(item)}>
        <Ionicons name="trash-outline" size={20} color="#E50914" />
      </TouchableOpacity>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>My Favorites</Text>
        <Text style={styles.headerCount}>{favorites.length} {favorites.length === 1 ? 'movie' : 'movies'}</Text>
      </View>

      {favorites.length === 0 ? (
        <View style={styles.empty}>
          <Ionicons name="heart-outline" size={64} color="#333" />
          <Text style={styles.emptyTitle}>No Favorites Yet</Text>
          <Text style={styles.emptyText}>Tap the heart icon on any movie to save it here.</Text>
          <TouchableOpacity style={styles.browseBtn} onPress={() => router.push('/(tabs)/home')}>
            <Text style={styles.browseBtnText}>Browse Movies</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={favorites}
          keyExtractor={item => item.id.toString()}
          renderItem={renderMovie}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0a0a1a' },
  header: {
    paddingHorizontal: 20, paddingTop: 56, paddingBottom: 16,
    backgroundColor: '#0f0f1f', borderBottomWidth: 1, borderBottomColor: '#1a1a2e',
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end',
  },
  headerTitle: { color: '#fff', fontSize: 24, fontWeight: '800' },
  headerCount: { color: '#E50914', fontWeight: '600' },
  list: { padding: 16, gap: 12 },
  item: {
    flexDirection: 'row', backgroundColor: '#0f0f1f',
    borderRadius: 12, overflow: 'hidden', borderWidth: 1, borderColor: '#1a1a2e',
  },
  poster: { width: 80, height: 120, backgroundColor: '#1a1a2e' },
  info: { flex: 1, padding: 12, justifyContent: 'center', gap: 4 },
  title: { color: '#fff', fontSize: 15, fontWeight: '700', lineHeight: 20 },
  ratingRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  rating: { color: '#f5c518', fontSize: 13, fontWeight: '600' },
  savedLabel: { color: '#888', fontSize: 11 },
  removeBtn: { padding: 16, justifyContent: 'center' },
  empty: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 32, gap: 12 },
  emptyTitle: { color: '#fff', fontSize: 20, fontWeight: '700' },
  emptyText: { color: '#888', textAlign: 'center', lineHeight: 20 },
  browseBtn: { backgroundColor: '#E50914', paddingHorizontal: 24, paddingVertical: 12, borderRadius: 10, marginTop: 8 },
  browseBtnText: { color: '#fff', fontWeight: '700' },
});
