import React from 'react';
import { TouchableOpacity, Text, StyleSheet, TouchableOpacityProps } from 'react-native';
import { theme } from '../utils/theme';

interface ButtonProps extends TouchableOpacityProps {
  title: string;
  variant?: 'primary' | 'secondary';
}

export const Button = ({ title, variant = 'primary', style, ...props }: ButtonProps) => {
  const bgColor = variant === 'primary' ? theme.colors.primary : theme.colors.secondary;
  
  return (
    <TouchableOpacity style={[styles.button, { backgroundColor: bgColor }, style]} {...props}>
      <Text style={styles.text}>{title}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    paddingVertical: theme.spacing.m,
    paddingHorizontal: theme.spacing.l,
    borderRadius: theme.borderRadius.round,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: theme.spacing.s,
  },
  text: {
    ...theme.typography.button,
  },
});
