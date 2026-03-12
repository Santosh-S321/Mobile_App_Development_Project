// TMDB API Configuration
// Get your free API key at: https://www.themoviedb.org/settings/api
const API_KEY = '1bf98bc7bd3b8e5bb1c140a13971cd0b'; // Replace with your TMDB API key
const BASE_URL = 'https://api.themoviedb.org/3';
export const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/w500';
export const BACKDROP_BASE_URL = 'https://image.tmdb.org/t/p/w780';

const fetchFromTMDB = async (endpoint, params = {}) => {
  const queryString = new URLSearchParams({ api_key: API_KEY, ...params }).toString();
  const url = `${BASE_URL}${endpoint}?${queryString}`;
  const response = await fetch(url);
  if (!response.ok) throw new Error(`TMDB API error: ${response.status}`);
  return response.json();
};

export const getTrendingMovies = () =>
  fetchFromTMDB('/trending/movie/week');

export const getPopularMovies = () =>
  fetchFromTMDB('/movie/popular');

export const getTopRatedMovies = () =>
  fetchFromTMDB('/movie/top_rated');

export const getMovieDetails = (movieId) =>
  fetchFromTMDB(`/movie/${movieId}`, { append_to_response: 'credits,videos' });

export const searchMovies = (query) =>
  fetchFromTMDB('/search/movie', { query });

export const getMoviesByGenre = (genreId) =>
  fetchFromTMDB('/discover/movie', { with_genres: genreId });
