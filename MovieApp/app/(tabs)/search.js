import { useState } from 'react';
import {
  View, Text, TextInput, FlatList, Image,
  TouchableOpacity, StyleSheet, ActivityIndicator,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { searchMovies, IMAGE_BASE_URL } from '../utils/api';

export default function SearchScreen() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const router = useRouter();

  const handleSearch = async () => {
    if (!query.trim()) return;
    setLoading(true);
    setSearched(true);
    try {
      const data = await searchMovies(query.trim());
      setResults(data.results || []);
    } catch (e) {
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity style={styles.item} onPress={() => router.push(`/movie/${item.id}`)} activeOpacity={0.8}>
      <Image
        source={{
          uri: item.poster_path
            ? `${IMAGE_BASE_URL}${item.poster_path}`
            : 'https://via.placeholder.com/60x90/1a1a2e/fff?text=?',
        }}
        style={styles.poster}
      />
      <View style={styles.info}>
        <Text style={styles.title} numberOfLines={2}>{item.title}</Text>
        <View style={styles.metaRow}>
          <Ionicons name="star" size={12} color="#f5c518" />
          <Text style={styles.rating}>{item.vote_average?.toFixed(1)}</Text>
          <Text style={styles.year}>{item.release_date?.split('-')[0]}</Text>
        </View>
        <Text style={styles.overview} numberOfLines={2}>{item.overview}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Search Movies</Text>
      </View>

      <View style={styles.searchBar}>
        <Ionicons name="search" size={18} color="#888" />
        <TextInput
          style={styles.input}
          placeholder="Search for a movie..."
          placeholderTextColor="#555"
          value={query}
          onChangeText={setQuery}
          onSubmitEditing={handleSearch}
          returnKeyType="search"
        />
        {query.length > 0 && (
          <TouchableOpacity onPress={() => { setQuery(''); setResults([]); setSearched(false); }}>
            <Ionicons name="close-circle" size={18} color="#888" />
          </TouchableOpacity>
        )}
      </View>

      {loading ? (
        <View style={styles.centered}>
          <ActivityIndicator size="large" color="#E50914" />
        </View>
      ) : searched && results.length === 0 ? (
        <View style={styles.centered}>
          <Ionicons name="film-outline" size={48} color="#333" />
          <Text style={styles.noResults}>No movies found for "{query}"</Text>
        </View>
      ) : !searched ? (
        <View style={styles.centered}>
          <Ionicons name="search-outline" size={56} color="#333" />
          <Text style={styles.hint}>Search for your favorite movies</Text>
        </View>
      ) : (
        <FlatList
          data={results}
          keyExtractor={item => item.id.toString()}
          renderItem={renderItem}
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
  },
  headerTitle: { color: '#fff', fontSize: 24, fontWeight: '800' },
  searchBar: {
    flexDirection: 'row', alignItems: 'center', gap: 10,
    margin: 16, backgroundColor: '#1a1a2e', borderRadius: 10,
    padding: 12, borderWidth: 1, borderColor: '#2a2a3e',
  },
  input: { flex: 1, color: '#fff', fontSize: 15 },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center', gap: 10 },
  noResults: { color: '#888', fontSize: 14 },
  hint: { color: '#555', fontSize: 14 },
  list: { padding: 16, gap: 12 },
  item: {
    flexDirection: 'row', backgroundColor: '#0f0f1f',
    borderRadius: 12, overflow: 'hidden', borderWidth: 1, borderColor: '#1a1a2e',
  },
  poster: { width: 80, height: 120, backgroundColor: '#1a1a2e' },
  info: { flex: 1, padding: 12, gap: 4 },
  title: { color: '#fff', fontSize: 15, fontWeight: '700', lineHeight: 20 },
  metaRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  rating: { color: '#f5c518', fontSize: 12, fontWeight: '600' },
  year: { color: '#888', fontSize: 12 },
  overview: { color: '#999', fontSize: 12, lineHeight: 16 },
});
