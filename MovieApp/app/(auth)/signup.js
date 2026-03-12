import { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity,
  StyleSheet, Alert, KeyboardAvoidingView,
  Platform, ScrollView, ActivityIndicator,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '../context/AuthContext';

export default function SignupScreen() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const { signup } = useAuth();
  const router = useRouter();

  const validate = () => {
    const newErrors = {};
    if (!username || username.trim().length < 3) newErrors.username = 'Username must be at least 3 characters.';
    if (!email || !email.includes('@') || !email.includes('.')) newErrors.email = 'Enter a valid email address.';
    if (!password || password.length < 6) newErrors.password = 'Password must be at least 6 characters.';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSignup = async () => {
    if (!validate()) return;
    setLoading(true);
    try {
      await signup(username.trim(), email.trim().toLowerCase(), password);
      router.replace('/(tabs)/home');
    } catch (error) {
      Alert.alert('Sign Up Failed', error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
        <View style={styles.logoContainer}>
          <View style={styles.logoBox}>
            <Text style={styles.logoText}>CINE</Text>
            <Text style={styles.logoAccent}>TRACK</Text>
          </View>
          <Text style={styles.tagline}>Your Personal Movie Journal</Text>
        </View>

        <Text style={styles.title}>Create Account</Text>
        <Text style={styles.subtitle}>Join CineTrack today</Text>

        {/* Username */}
        <View style={styles.inputWrapper}>
          <Text style={styles.label}>Username</Text>
          <TextInput
            style={[styles.input, errors.username && styles.inputError]}
            placeholder="e.g. moviefan123"
            placeholderTextColor="#555"
            value={username}
            onChangeText={(t) => { setUsername(t); setErrors(p => ({ ...p, username: '' })); }}
            autoCapitalize="none"
          />
          {errors.username ? <Text style={styles.errorText}>{errors.username}</Text> : null}
        </View>

        {/* Email */}
        <View style={styles.inputWrapper}>
          <Text style={styles.label}>Email</Text>
          <TextInput
            style={[styles.input, errors.email && styles.inputError]}
            placeholder="you@example.com"
            placeholderTextColor="#555"
            value={email}
            onChangeText={(t) => { setEmail(t); setErrors(p => ({ ...p, email: '' })); }}
            keyboardType="email-address"
            autoCapitalize="none"
          />
          {errors.email ? <Text style={styles.errorText}>{errors.email}</Text> : null}
        </View>

        {/* Password */}
        <View style={styles.inputWrapper}>
          <Text style={styles.label}>Password</Text>
          <TextInput
            style={[styles.input, errors.password && styles.inputError]}
            placeholder="Min. 6 characters"
            placeholderTextColor="#555"
            value={password}
            onChangeText={(t) => { setPassword(p => { setErrors(e => ({ ...e, password: '' })); return t; })}}
            secureTextEntry
          />
          {errors.password ? <Text style={styles.errorText}>{errors.password}</Text> : null}
        </View>

        <TouchableOpacity style={styles.button} onPress={handleSignup} disabled={loading}>
          {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Create Account</Text>}
        </TouchableOpacity>

        <View style={styles.footer}>
          <Text style={styles.footerText}>Already have an account? </Text>
          <TouchableOpacity onPress={() => router.push('/(auth)/login')}>
            <Text style={styles.link}>Sign In</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0a0a1a' },
  scroll: { flexGrow: 1, justifyContent: 'center', padding: 24 },
  logoContainer: { alignItems: 'center', marginBottom: 36 },
  logoBox: { flexDirection: 'row', alignItems: 'center' },
  logoText: { fontSize: 36, fontWeight: '900', color: '#fff', letterSpacing: 2 },
  logoAccent: { fontSize: 36, fontWeight: '900', color: '#E50914', letterSpacing: 2 },
  tagline: { color: '#888', marginTop: 4, fontSize: 13 },
  title: { fontSize: 28, fontWeight: '700', color: '#fff', marginBottom: 4 },
  subtitle: { color: '#888', marginBottom: 28, fontSize: 15 },
  inputWrapper: { marginBottom: 16 },
  label: { color: '#aaa', fontSize: 13, marginBottom: 6, fontWeight: '600' },
  input: {
    backgroundColor: '#1a1a2e', color: '#fff', borderRadius: 10,
    padding: 14, fontSize: 15, borderWidth: 1, borderColor: '#2a2a3e',
  },
  inputError: { borderColor: '#E50914' },
  errorText: { color: '#E50914', fontSize: 12, marginTop: 4 },
  button: {
    backgroundColor: '#E50914', borderRadius: 10, padding: 16,
    alignItems: 'center', marginTop: 8,
  },
  buttonText: { color: '#fff', fontWeight: '700', fontSize: 16 },
  footer: { flexDirection: 'row', justifyContent: 'center', marginTop: 24 },
  footerText: { color: '#888' },
  link: { color: '#E50914', fontWeight: '600' },
});
