import { useState, useEffect } from 'react';
import {
  View, Text, ScrollView, Image, TouchableOpacity,
  StyleSheet, ActivityIndicator, Dimensions, Alert,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { getMovieDetails, IMAGE_BASE_URL, BACKDROP_BASE_URL } from '../utils/api';
import { useFavorites } from '../context/FavoritesContext';

const { width } = Dimensions.get('window');

export default function MovieDetailScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const { isFavorite, addFavorite, removeFavorite } = useFavorites();

  useEffect(() => {
    fetchDetails();
  }, [id]);

  const fetchDetails = async () => {
    try {
      const data = await getMovieDetails(id);
      setMovie(data);
    } catch (e) {
      Alert.alert('Error', 'Could not load movie details.');
    } finally {
      setLoading(false);
    }
  };

  const toggleFavorite = () => {
    if (isFavorite(movie.id)) {
      removeFavorite(movie.id);
    } else {
      addFavorite({ id: movie.id, title: movie.title, poster_path: movie.poster_path, vote_average: movie.vote_average });
    }
  };

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#E50914" />
      </View>
    );
  }

  if (!movie) return null;

  const favorited = isFavorite(movie.id);

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Backdrop */}
      <View style={styles.backdropContainer}>
        <Image
          source={{
            uri: movie.backdrop_path
              ? `${BACKDROP_BASE_URL}${movie.backdrop_path}`
              : `${IMAGE_BASE_URL}${movie.poster_path}`,
          }}
          style={styles.backdrop}
        />
        <View style={styles.backdropOverlay} />
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={22} color="#fff" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.favoriteBtn} onPress={toggleFavorite}>
          <Ionicons name={favorited ? 'heart' : 'heart-outline'} size={24} color={favorited ? '#E50914' : '#fff'} />
        </TouchableOpacity>
      </View>

      {/* Content */}
      <View style={styles.content}>
        <View style={styles.posterRow}>
          <Image
            source={{ uri: `${IMAGE_BASE_URL}${movie.poster_path}` }}
            style={styles.poster}
          />
          <View style={styles.titleBlock}>
            <Text style={styles.title}>{movie.title}</Text>
            {movie.tagline ? <Text style={styles.tagline}>"{movie.tagline}"</Text> : null}
            <View style={styles.metaRow}>
              <Ionicons name="star" size={14} color="#f5c518" />
              <Text style={styles.rating}>{movie.vote_average?.toFixed(1)}</Text>
              <Text style={styles.metaDot}>•</Text>
              <Text style={styles.meta}>{movie.release_date?.split('-')[0]}</Text>
              <Text style={styles.metaDot}>•</Text>
              <Text style={styles.meta}>{movie.runtime} min</Text>
            </View>
            <View style={styles.genreRow}>
              {movie.genres?.slice(0, 3).map(g => (
                <View key={g.id} style={styles.genreBadge}>
                  <Text style={styles.genreText}>{g.name}</Text>
                </View>
              ))}
            </View>
          </View>
        </View>

        {/* Overview */}
        <Text style={styles.sectionTitle}>Overview</Text>
        <Text style={styles.overview}>{movie.overview}</Text>

        {/* Cast */}
        {movie.credits?.cast?.length > 0 && (
          <>
            <Text style={styles.sectionTitle}>Top Cast</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.castRow}>
              {movie.credits.cast.slice(0, 8).map(actor => (
                <View key={actor.id} style={styles.castCard}>
                  <Image
                    source={{
                      uri: actor.profile_path
                        ? `${IMAGE_BASE_URL}${actor.profile_path}`
                        : 'https://via.placeholder.com/80x80/1a1a2e/fff?text=?',
                    }}
                    style={styles.castImage}
                  />
                  <Text style={styles.castName} numberOfLines={2}>{actor.name}</Text>
                  <Text style={styles.castChar} numberOfLines={1}>{actor.character}</Text>
                </View>
              ))}
            </ScrollView>
          </>
        )}

        <TouchableOpacity
          style={[styles.favBtn, favorited && styles.favBtnActive]}
          onPress={toggleFavorite}
        >
          <Ionicons name={favorited ? 'heart' : 'heart-outline'} size={18} color="#fff" />
          <Text style={styles.favBtnText}>
            {favorited ? 'Remove from Favorites' : 'Add to Favorites'}
          </Text>
        </TouchableOpacity>

        <View style={{ height: 40 }} />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0a0a1a' },
  centered: { flex: 1, backgroundColor: '#0a0a1a', justifyContent: 'center', alignItems: 'center' },
  backdropContainer: { width, height: 240, position: 'relative' },
  backdrop: { width: '100%', height: '100%' },
  backdropOverlay: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(10,10,26,0.5)' },
  backBtn: {
    position: 'absolute', top: 52, left: 16,
    backgroundColor: 'rgba(0,0,0,0.6)', borderRadius: 20, padding: 8,
  },
  favoriteBtn: {
    position: 'absolute', top: 52, right: 16,
    backgroundColor: 'rgba(0,0,0,0.6)', borderRadius: 20, padding: 8,
  },
  content: { padding: 16 },
  posterRow: { flexDirection: 'row', gap: 14, marginBottom: 20 },
  poster: { width: 110, height: 165, borderRadius: 10, backgroundColor: '#1a1a2e' },
  titleBlock: { flex: 1, justifyContent: 'center', gap: 6 },
  title: { color: '#fff', fontSize: 20, fontWeight: '800', lineHeight: 26 },
  tagline: { color: '#E50914', fontSize: 12, fontStyle: 'italic' },
  metaRow: { flexDirection: 'row', alignItems: 'center', gap: 4, flexWrap: 'wrap' },
  rating: { color: '#f5c518', fontWeight: '600', fontSize: 13 },
  metaDot: { color: '#555' },
  meta: { color: '#aaa', fontSize: 13 },
  genreRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
  genreBadge: { backgroundColor: '#1a1a2e', borderRadius: 12, paddingHorizontal: 10, paddingVertical: 4 },
  genreText: { color: '#ccc', fontSize: 11 },
  sectionTitle: { color: '#fff', fontSize: 16, fontWeight: '700', marginBottom: 10, marginTop: 4 },
  overview: { color: '#bbb', lineHeight: 22, fontSize: 14, marginBottom: 16 },
  castRow: { marginBottom: 20 },
  castCard: { width: 80, marginRight: 12, alignItems: 'center' },
  castImage: { width: 64, height: 64, borderRadius: 32, backgroundColor: '#1a1a2e', marginBottom: 4 },
  castName: { color: '#fff', fontSize: 10, textAlign: 'center', fontWeight: '600' },
  castChar: { color: '#888', fontSize: 9, textAlign: 'center' },
  favBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    gap: 8, backgroundColor: '#1a1a2e', borderRadius: 10, padding: 14,
    borderWidth: 1, borderColor: '#2a2a3e',
  },
  favBtnActive: { backgroundColor: '#2a0a0a', borderColor: '#E50914' },
  favBtnText: { color: '#fff', fontWeight: '600', fontSize: 15 },
});
