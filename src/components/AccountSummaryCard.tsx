import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Card } from './Card';
import { theme } from '../utils/theme';
import { formatCurrency } from '../utils/finance';

interface Props {
  balance: number;
  interestRate: number;
  ytdInterest: number;
  onPress?: () => void;
}

export const AccountSummaryCard = ({ balance, interestRate, ytdInterest, onPress }: Props) => {
  const cardContent = (
    <Card style={styles.card}>
      <Text style={styles.title}>My Savings</Text>
      <Text style={styles.balance}>{formatCurrency(balance)}</Text>
      <View style={styles.row}>
        <Text style={styles.statLabel}>Interest Rate:</Text>
        <Text style={styles.statValue}>{interestRate.toFixed(1)}% APY</Text>
      </View>
      <View style={styles.row}>
        <Text style={styles.statLabel}>YTD Earned:</Text>
        <Text style={styles.statValue}>{formatCurrency(ytdInterest)}</Text>
      </View>
    </Card>
  );

  if (onPress) {
    return <TouchableOpacity onPress={onPress} activeOpacity={0.8}>{cardContent}</TouchableOpacity>;
  }
  return cardContent;
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: theme.colors.primary,
    padding: theme.spacing.xl,
  },
  title: {
    ...theme.typography.h2,
    color: theme.colors.surface,
    marginBottom: theme.spacing.m,
  },
  balance: {
    fontSize: 48,
    fontWeight: 'bold',
    color: theme.colors.surface,
    marginBottom: theme.spacing.l,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: theme.spacing.s,
  },
  statLabel: {
    ...theme.typography.body,
    color: 'rgba(255,255,255,0.8)',
  },
  statValue: {
    ...theme.typography.body,
    fontWeight: 'bold',
    color: theme.colors.surface,
  }
});
