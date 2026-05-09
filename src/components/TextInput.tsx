import React from 'react';
import { TextInput as RNTextInput, StyleSheet, TextInputProps, View, Text } from 'react-native';
import { theme } from '../utils/theme';

interface Props extends TextInputProps {
  label?: string;
  error?: string;
}

export const TextInput = ({ label, error, style, ...props }: Props) => {
  return (
    <View style={styles.container}>
      {label && <Text style={styles.label}>{label}</Text>}
      <RNTextInput 
        style={[
          styles.input, 
          error ? styles.inputError : null,
          style
        ]} 
        placeholderTextColor={theme.colors.textLight}
        {...props} 
      />
      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: theme.spacing.s,
  },
  label: {
    ...theme.typography.body,
    fontWeight: 'bold',
    marginBottom: theme.spacing.s / 2,
  },
  input: {
    ...theme.typography.body,
    borderWidth: 2,
    borderColor: theme.colors.border,
    borderRadius: theme.borderRadius.m,
    padding: theme.spacing.m,
    backgroundColor: theme.colors.surface,
  },
  inputError: {
    borderColor: theme.colors.error,
  },
  errorText: {
    color: theme.colors.error,
    fontSize: 14,
    marginTop: 4,
  }
});
