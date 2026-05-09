import React from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import { Card } from './Card';
import { theme } from '../utils/theme';
import { formatCurrency } from '../utils/finance';

interface Transaction {
  id: string;
  amount: number;
  type: string;
  date: any; // Firestore Timestamp
  description: string;
}

export const TransactionList = ({ transactions }: { transactions: Transaction[] }) => {
  const renderItem = ({ item }: { item: Transaction }) => {
    const isPositive = item.amount >= 0;
    const amountColor = isPositive ? theme.colors.success : theme.colors.text;
    const dateStr = item.date?.toDate ? item.date.toDate().toLocaleDateString() : 'Pending...';
    
    return (
      <View style={styles.transactionRow}>
        <View>
          <Text style={styles.description}>{item.description}</Text>
          <Text style={styles.date}>{dateStr}</Text>
        </View>
        <Text style={[styles.amount, { color: amountColor }]}>
          {isPositive ? '+' : ''}{formatCurrency(item.amount)}
        </Text>
      </View>
    );
  };

  return (
    <Card style={styles.card}>
      <Text style={styles.title}>Recent Activity</Text>
      {transactions.length === 0 ? (
        <Text style={styles.emptyText}>No transactions yet.</Text>
      ) : (
        <FlatList
          data={transactions}
          keyExtractor={item => item.id}
          renderItem={renderItem}
          scrollEnabled={false}
        />
      )}
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    padding: theme.spacing.m,
  },
  title: {
    ...theme.typography.h2,
    marginBottom: theme.spacing.m,
  },
  transactionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: theme.spacing.s,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  description: {
    ...theme.typography.body,
    fontWeight: 'bold',
  },
  date: {
    fontSize: 14,
    color: theme.colors.textLight,
  },
  amount: {
    ...theme.typography.body,
    fontWeight: 'bold',
  },
  emptyText: {
    ...theme.typography.body,
    color: theme.colors.textLight,
    textAlign: 'center',
    padding: theme.spacing.m,
  }
});
