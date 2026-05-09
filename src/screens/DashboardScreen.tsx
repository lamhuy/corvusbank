import React, { useEffect, useState } from 'react';
import { View, StyleSheet, SafeAreaView, Text, ActivityIndicator } from 'react-native';
import { AccountSummaryCard } from '../components/AccountSummaryCard';
import { Button } from '../components/Button';
import { theme } from '../utils/theme';
import { useAuth } from '../services/authContext';
import { subscribeToUserAccount } from '../services/db';
import { logout } from '../services/auth';

export default function DashboardScreen({ navigation }: any) {
  const { user } = useAuth();
  const [account, setAccount] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    
    const unsubscribe = subscribeToUserAccount(user.uid, (data) => {
      setAccount(data);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user]);

  if (loading) {
    return (
      <View style={[styles.container, styles.centered]}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.welcomeText}>Hi there!</Text>
          <Button title="Log Out" variant="secondary" onPress={logout} style={styles.logoutBtn} />
        </View>
        
        {account ? (
          <AccountSummaryCard 
            balance={account.balance}
            interestRate={account.interestRate}
            ytdInterest={account.ytdInterest}
            onPress={() => navigation.navigate('AccountDetails', { accountId: account.id })}
          />
        ) : (
          <Text style={styles.errorText}>No account found.</Text>
        )}
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
  },
  centered: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.l,
    marginTop: theme.spacing.s,
  },
  welcomeText: {
    ...theme.typography.h1,
  },
  logoutBtn: {
    paddingVertical: theme.spacing.s,
    paddingHorizontal: theme.spacing.m,
  },
  errorText: {
    ...theme.typography.body,
    textAlign: 'center',
    marginTop: theme.spacing.xl,
    color: theme.colors.textLight,
  }
});
