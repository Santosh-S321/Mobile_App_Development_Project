import { useState, useEffect } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, Image,
  StyleSheet, ActivityIndicator, RefreshControl,
  Dimensions, TextInput,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../context/AuthContext';
import { getTrendingMovies, getPopularMovies, getTopRatedMovies, IMAGE_BASE_URL } from '../utils/api';

const { width } = Dimensions.get('window');
const CARD_WIDTH = width * 0.38;

export default function HomeScreen() {
  const { user } = useAuth();
  const router = useRouter();
  const [trending, setTrending] = useState([]);
  const [popular, setPopular] = useState([]);
  const [topRated, setTopRated] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);

  const loadMovies = async () => {
    try {
      setError(null);
      const [trendingData, popularData, topRatedData] = await Promise.all([
        getTrendingMovies(),
        getPopularMovies(),
        getTopRatedMovies(),
      ]);
      setTrending(trendingData.results?.slice(0, 10) || []);
      setPopular(popularData.results?.slice(0, 10) || []);
      setTopRated(topRatedData.results?.slice(0, 10) || []);
    } catch (e) {
      setError('Failed to load movies. Check your API key in utils/api.js');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => { loadMovies(); }, []);

  const onRefresh = () => { setRefreshing(true); loadMovies(); };

  const MovieCard = ({ movie }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => router.push(`/movie/${movie.id}`)}
      activeOpacity={0.8}
    >
      <Image
        source={{
          uri: movie.poster_path
            ? `${IMAGE_BASE_URL}${movie.poster_path}`
            : 'https://via.placeholder.com/150x225/1a1a2e/fff?text=No+Image',
        }}
        style={styles.cardImage}
      />
      <View style={styles.cardInfo}>
        <Text style={styles.cardTitle} numberOfLines={2}>{movie.title}</Text>
        <View style={styles.ratingRow}>
          <Ionicons name="star" size={11} color="#f5c518" />
          <Text style={styles.rating}>{movie.vote_average?.toFixed(1)}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  const Section = ({ title, data }) => (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>{title}</Text>
        <Ionicons name="chevron-forward" size={16} color="#E50914" />
      </View>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.row}>
        {data.map(movie => <MovieCard key={movie.id} movie={movie} />)}
      </ScrollView>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.logoRow}>
          <Text style={styles.logoText}>CINE</Text>
          <Text style={styles.logoAccent}>TRACK</Text>
        </View>
        <TouchableOpacity onPress={() => router.push('/settings')}>
          <Ionicons name="menu" size={28} color="#fff" />
        </TouchableOpacity>
      </View>

      {/* Greeting */}
      <View style={styles.greetingBar}>
        <Text style={styles.greeting}>Hello, {user?.username || 'Movie Fan'} 👋</Text>
        <Text style={styles.greetingSub}>What are you watching tonight?</Text>
      </View>

      {loading ? (
        <View style={styles.centered}>
          <ActivityIndicator size="large" color="#E50914" />
          <Text style={styles.loadingText}>Loading movies...</Text>
        </View>
      ) : error ? (
        <View style={styles.centered}>
          <Ionicons name="alert-circle" size={48} color="#E50914" />
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity style={styles.retryBtn} onPress={loadMovies}>
            <Text style={styles.retryText}>Retry</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <ScrollView
          showsVerticalScrollIndicator={false}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#E50914" />}
        >
          <Section title="🔥 Trending This Week" data={trending} />
          <Section title="🎬 Popular Now" data={popular} />
          <Section title="⭐ Top Rated" data={topRated} />
          <View style={{ height: 20 }} />
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0a0a1a' },
  header: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingHorizontal: 20, paddingTop: 56, paddingBottom: 12,
    backgroundColor: '#0f0f1f', borderBottomWidth: 1, borderBottomColor: '#1a1a2e',
  },
  logoRow: { flexDirection: 'row' },
  logoText: { fontSize: 22, fontWeight: '900', color: '#fff', letterSpacing: 1.5 },
  logoAccent: { fontSize: 22, fontWeight: '900', color: '#E50914', letterSpacing: 1.5 },
  greetingBar: { paddingHorizontal: 20, paddingVertical: 14 },
  greeting: { fontSize: 18, fontWeight: '700', color: '#fff' },
  greetingSub: { color: '#888', fontSize: 13, marginTop: 2 },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 24 },
  loadingText: { color: '#888', marginTop: 12 },
  errorText: { color: '#aaa', textAlign: 'center', marginTop: 12, lineHeight: 20 },
  retryBtn: { marginTop: 16, backgroundColor: '#E50914', paddingHorizontal: 24, paddingVertical: 10, borderRadius: 8 },
  retryText: { color: '#fff', fontWeight: '600' },
  section: { marginTop: 8 },
  sectionHeader: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingHorizontal: 20, marginBottom: 12,
  },
  sectionTitle: { color: '#fff', fontSize: 16, fontWeight: '700' },
  row: { paddingHorizontal: 16, gap: 12 },
  card: { width: CARD_WIDTH, marginBottom: 8 },
  cardImage: { width: CARD_WIDTH, height: CARD_WIDTH * 1.5, borderRadius: 10, backgroundColor: '#1a1a2e' },
  cardInfo: { padding: 6 },
  cardTitle: { color: '#fff', fontSize: 12, fontWeight: '600', lineHeight: 16 },
  ratingRow: { flexDirection: 'row', alignItems: 'center', marginTop: 4, gap: 3 },
  rating: { color: '#f5c518', fontSize: 11 },
});
