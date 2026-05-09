import React, { useState } from 'react';
import { Modal, View, StyleSheet, Text, ActivityIndicator } from 'react-native';
import { TextInput } from './TextInput';
import { Button } from './Button';
import { Card } from './Card';
import { theme } from '../utils/theme';

interface Props {
  visible: boolean;
  onClose: () => void;
  onSubmit: (amountCents: number) => Promise<void>;
}

export const DepositModal = ({ visible, onClose, onSubmit }: Props) => {
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async () => {
    setError('');
    
    const parsedAmount = parseFloat(amount);
    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      setError('Please enter a valid amount.');
      return;
    }

    setLoading(true);
    try {
      const amountCents = Math.round(parsedAmount * 100);
      await onSubmit(amountCents);
      setAmount('');
      onClose();
    } catch (err: any) {
      setError(err.message || 'Deposit failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={styles.overlay}>
        <Card style={styles.card}>
          <Text style={styles.title}>Make a Deposit</Text>
          <TextInput
            label="Amount ($)"
            placeholder="0.00"
            keyboardType="numeric"
            value={amount}
            onChangeText={setAmount}
          />
          {error ? <Text style={styles.error}>{error}</Text> : null}
          
          {loading ? (
            <ActivityIndicator size="large" color={theme.colors.primary} />
          ) : (
            <View style={styles.row}>
              <Button title="Cancel" variant="secondary" onPress={onClose} style={styles.btn} />
              <Button title="Deposit" onPress={handleSubmit} style={styles.btn} />
            </View>
          )}
        </Card>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    padding: theme.spacing.l,
  },
  card: {
    padding: theme.spacing.xl,
  },
  title: {
    ...theme.typography.h2,
    textAlign: 'center',
    marginBottom: theme.spacing.m,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: theme.spacing.m,
  },
  btn: {
    flex: 1,
    marginHorizontal: theme.spacing.s / 2,
  },
  error: {
    color: theme.colors.error,
    textAlign: 'center',
    marginTop: theme.spacing.s,
  }
});
