import React, { useEffect, useState } from 'react';
import { View, StyleSheet, SafeAreaView, ScrollView, Text, TouchableOpacity } from 'react-native';
import { theme } from '../utils/theme';
import { useAuth } from '../services/authContext';
import { subscribeToUserAccount, subscribeToTransactions, processDeposit } from '../services/db';
import { AccountSummaryCard } from '../components/AccountSummaryCard';
import { TransactionList } from '../components/TransactionList';
import { DepositModal } from '../components/DepositModal';
import { Button } from '../components/Button';

export default function AccountDetailsScreen({ route, navigation }: any) {
  const { accountId } = route.params || {};
  const { user } = useAuth();
  
  const [account, setAccount] = useState<any>(null);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    if (!user) return;
    const unsubAccount = subscribeToUserAccount(user.uid, setAccount);
    return () => unsubAccount();
  }, [user]);

  useEffect(() => {
    if (!accountId) return;
    const unsubTx = subscribeToTransactions(accountId, setTransactions);
    return () => unsubTx();
  }, [accountId]);

  const handleDeposit = async (amountCents: number) => {
    await processDeposit(accountId, amountCents);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Text style={styles.backText}>← Back to Dashboard</Text>
        </TouchableOpacity>

        {account && (
          <View style={styles.section}>
            <AccountSummaryCard 
              balance={account.balance}
              interestRate={account.interestRate}
              ytdInterest={account.ytdInterest}
            />
          </View>
        )}

        <View style={styles.section}>
          <Button title="Make a Deposit" onPress={() => setModalVisible(true)} />
        </View>

        <View style={styles.section}>
          <TransactionList transactions={transactions} />
        </View>

        <DepositModal 
          visible={modalVisible}
          onClose={() => setModalVisible(false)}
          onSubmit={handleDeposit}
        />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  container: {
    padding: theme.spacing.m,
  },
  backBtn: {
    paddingVertical: theme.spacing.m,
  },
  backText: {
    ...theme.typography.body,
    color: theme.colors.primary,
    fontWeight: 'bold',
  },
  section: {
    marginBottom: theme.spacing.l,
  }
});
