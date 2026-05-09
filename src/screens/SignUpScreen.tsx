import React, { useState } from 'react';
import { View, StyleSheet, SafeAreaView, Text } from 'react-native';
import { TextInput } from '../components/TextInput';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { theme } from '../utils/theme';
import { registerWithUsername } from '../services/auth';
import { isUsernameAvailable } from '../services/db';

export default function SignUpScreen({ navigation }: any) {
  const [username, setUsername] = useState('');
  const [pin, setPin] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSignUp = async () => {
    setError('');
    
    // Validation
    if (!username || username.trim().length < 3) {
      setError('Username must be at least 3 characters');
      return;
    }
    
    const pinRegex = /^\d{4}$/;
    if (!pinRegex.test(pin)) {
      setError('PIN must be exactly 4 digits');
      return;
    }

    setLoading(true);
    try {
      // Check uniqueness
      const available = await isUsernameAvailable(username);
      if (!available) {
        setError('Username is already taken. Please choose another.');
        setLoading(false);
        return;
      }

      await registerWithUsername(username, pin);
      // AppNavigator will handle redirection based on auth context
    } catch (err: any) {
      setError(err.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Text style={styles.title}>Welcome to CorvusBank!</Text>
        <Card style={styles.card}>
          <TextInput 
            label="Username" 
            placeholder="e.g. superhero123" 
            value={username}
            onChangeText={setUsername}
            autoCapitalize="none"
          />
          <TextInput 
            label="4-Digit PIN" 
            placeholder="e.g. 1234" 
            value={pin}
            onChangeText={setPin}
            keyboardType="numeric"
            maxLength={4}
            secureTextEntry
          />
          
          {error ? <Text style={styles.errorText}>{error}</Text> : null}
          
          <Button 
            title={loading ? "Creating..." : "Sign Up"} 
            onPress={handleSignUp} 
            disabled={loading}
          />
        </Card>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  container: {
    flex: 1,
    padding: theme.spacing.m,
    justifyContent: 'center',
  },
  title: {
    ...theme.typography.h1,
    textAlign: 'center',
    marginBottom: theme.spacing.l,
    color: theme.colors.primary,
  },
  card: {
    padding: theme.spacing.l,
  },
  errorText: {
    color: theme.colors.error,
    marginBottom: theme.spacing.m,
    textAlign: 'center',
  }
});
